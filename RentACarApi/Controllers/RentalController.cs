using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using RentACarApi.Data;
using RentACarApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace RentACarAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RentalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRentals()
        {
            var rentals = await _context.Rentals
                .Include(r => r.Car)
                .Include(r => r.User)
                .ToListAsync();

            return Ok(rentals);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> RentCar([FromBody] RentalCreateDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Kullanıcı bilgisi alınamadı.");

            var car = await _context.Cars.FindAsync(dto.CarId);

            if (car == null)
                return NotFound("Araç bulunamadı.");

            if (!car.IsAvailable)
                return BadRequest("Araç şu anda kiralanamaz.");

            var rental = new Rental
            {
                CarId = dto.CarId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = userId,
                TotalPrice = CalculateTotalPrice(dto.StartDate, dto.EndDate, car.PricePerDay),
                Car = car
            };

            car.IsAvailable = false;

            _context.Rentals.Add(rental);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRentals), new { id = rental.Id }, rental);
        }

        [Authorize]
        [HttpPut("return/{id}")]
        public async Task<IActionResult> ReturnCar(int id)
        {
            var rental = await _context.Rentals
                .Include(r => r.Car)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rental == null)
                return NotFound("Kiralama bulunamadı.");

            if (rental.Car.IsAvailable)
                return BadRequest("Araç zaten iade edilmiş.");

            // 🔄 Güncelleme
            var today = DateTime.Today;
            rental.EndDate = today;

            int days = (rental.EndDate - rental.StartDate).Days;
            days = days == 0 ? 1 : days; // En az 1 gün

            rental.TotalPrice = days * rental.Car.PricePerDay;

            rental.Car.IsAvailable = true;

            // 🧠 EF’nin gerçekten güncellediğinden emin ol
            _context.Rentals.Update(rental);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "İade başarılı.",
                totalPrice = rental.TotalPrice,
                newEndDate = rental.EndDate.ToShortDateString()
            });
        }


        [Authorize]
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveRentals()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Kullanıcı bilgisi alınamadı.");

            var rentals = await _context.Rentals
                .Include(r => r.Car)
                .Where(r => r.UserId == userId && r.Car.IsAvailable == false)
                .GroupBy(r => r.CarId)
                .Select(g => g.OrderByDescending(r => r.StartDate).First())
                .ToListAsync();

            return Ok(rentals);
        }

        private decimal CalculateTotalPrice(DateTime start, DateTime end, decimal dailyPrice)
        {
            var days = (end.Date - start.Date).Days;
            if (days < 0)
            {
                throw new ArgumentException("Bitiş tarihi başlangıç tarihinden önce olamaz.");
            }
            if (days <= 0) days = 1;
            return days * dailyPrice;
        }
    }
}
