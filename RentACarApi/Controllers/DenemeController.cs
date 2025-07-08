

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACarApi.Models;

namespace RentACarApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DenemeController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet("public")]
        public IActionResult EveryoneCanAccess() => Ok("Herkese açık!");

        [Authorize(Roles = "User,Admin")]
        [HttpGet("members")]
        public IActionResult OnlyLoggedIn() => Ok("Sadece token sahibi kullanıcı!");

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult OnlyAdmin() => Ok("Sadece admin görebilir.");
    }
}
