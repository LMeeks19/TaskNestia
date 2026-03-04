using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.RequestObjects;
using Server.Database;
using Server.Models;
using Server.Objects;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpPost("[action]")]
        public async Task<IActionResult> AddSection([FromBody] CreateSectionRequest request)
        {
            var username = User.Identity?.Name?.Split("\\")[1];
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return Unauthorized();

            var section = new Section
            {
                SheetId = request.SheetId,
                Name = request.Name.Trim(),
                LastModified = DateTime.UtcNow,
            };

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            var sectionModel = await _context.Sections
                .Select(s => new SectionModel
                {
                    Id = s.Id,
                    SheetId = s.SheetId,
                    Name = s.Name,
                    LastModified = s.LastModified,
                    Items = new List<ItemModel>()
                })
                .SingleAsync(s => s.Id == section.Id);

            return Ok(sectionModel);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var section = await _context.Sections
                .Include(s => s.Items)
                .SingleOrDefaultAsync(s => s.Id == id);

            if (section == null)
                return NotFound();

            _context.Items.RemoveRange(section.Items);
            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();

            return Ok(section.Id);
        }
    }
}
