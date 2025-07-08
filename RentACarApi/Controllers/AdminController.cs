using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RentACarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet("secret")]
        public IActionResult AdminOnlyData()
        {
            return Ok("🔐 Sadece adminler görebilir.");
        }
    }
}
