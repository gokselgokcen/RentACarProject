using Microsoft.AspNetCore.Mvc;
using RentACarApi.Data;
using RentACarApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace RentACarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCars()
        {
            var cars = await _context.Cars.ToListAsync();
            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
                return NotFound();

            return Ok(car);
        }

        [HttpPost]
        public IActionResult AddCar(Car car)
        {
            _context.Cars.Add(car);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, Car updatedCar)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            car.Brand = updatedCar.Brand;
            car.Model = updatedCar.Model;
            car.PricePerDay = updatedCar.PricePerDay;
            car.IsAvailable = updatedCar.IsAvailable;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
