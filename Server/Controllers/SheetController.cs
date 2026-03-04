using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.RequestObjects;
using Server.Database;
using Server.Helpers;
using Server.Models;
using Server.Objects;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SheetController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserSheets()
        {
            var username = User.Identity?.Name?.Split("\\")[1];
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return Unauthorized();

            var sheets = await _context.Sheets
                .Where(s => s.UserId == user.Id)
                .Select(s => new SheetModel 
                { 
                    Id = s.Id, 
                    Name = s.Name, 
                    HexColour = s.HexColour 
                })
                .ToListAsync();

            return Ok(sheets);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSheet([FromBody] CreateSheetRequest request)
        {
            var username = User.Identity?.Name?.Split("\\")[1];
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return Unauthorized();

            var sheet = new Sheet
            {
                UserId = user.Id,
                Name = request.Name.Trim(),
                HexColour = RandomHexColourGenerator.GetRandomHexColor()
            };

            _context.Sheets.Add(sheet);
            await _context.SaveChangesAsync();

            var sheetModel = await _context.Sheets
                .Select(s => new SheetModel 
                { 
                    Id = s.Id,
                    Name = s.Name,
                    HexColour = s.HexColour
                })
                .SingleAsync(s => s.Id == sheet.Id);

            return Ok(sheetModel);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteSheet(int id)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var sheet = await _context.Sheets.SingleOrDefaultAsync(s => s.Id == id);

            if (sheet == null)
                return NotFound();

            _context.Sheets.Remove(sheet);
            await _context.SaveChangesAsync();

            return Ok(sheet.Id);
        }
    }
}