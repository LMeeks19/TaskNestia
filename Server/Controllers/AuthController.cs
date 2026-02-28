using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskNestia.Server.Database;
using TaskNestia.Server.Enums;
using TaskNestia.Server.Helpers;
using TaskNestia.Server.Objects;

namespace TaskNestia.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpPost("[action]")]
        [Authorize(Roles = UserRoleConverter.Admin)]
        public async Task<IActionResult> SetAdmin()
        {
            var username = User.Identity?.Name;

            if (username == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound();

            user.Role = UserRoleEnum.Admin;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var windowsUsername = User.Identity?.Name;

            if (windowsUsername == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == windowsUsername.Split("\\")[1]);

            if (user == null)
            {
                user = new User
                {
                    Username = windowsUsername.Split("\\")[1],
                    Role = UserRoleEnum.User,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }
    }
}