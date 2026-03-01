using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Database;
using Server.Enums;
using Server.Helpers;
using Server.Models;
using Server.Objects;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize(Roles = UserRoleConverter.Admin)]
        [HttpPost("[action]")]
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

            return Ok(new UserModel
            {
                Username = user.Username,
                Role = user.Role,
                CreatedAt = DateTime.UtcNow
            });

        }
    }
}