using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.RequestModels;
using Server.Database;
using Server.Models;
using Server.Objects;


namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpPost("[action]")]
        public async Task<IActionResult> AddItem([FromBody] CreateItemRequestModel request)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var item = new Item
            {
                SheetId = request.SheetId,
                SectionId = request.SectionId,
                Name =request.Name.Trim(),
                Description = request.Description.Trim(),
                LastModified = DateTime.UtcNow,
                IsComplete = false,
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var itemModel = await _context.Items
                .Select(s => new ItemModel
                {
                    Id = s.Id,
                    SheetId = s.SheetId,
                    SectionId = s.SectionId,
                    Name = s.Name,
                    Description = s.Description,
                    LastModified = s.LastModified,
                    IsComplete = s.IsComplete,
                })
                .SingleAsync(s => s.Id == item.Id);

            return Ok(itemModel);
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var item = await _context.Items
                .SingleOrDefaultAsync(s => s.Id == id);

            if (item == null)
                return NotFound();

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(item.Id);
        }

        [HttpPatch("[action]")]
        public async Task<IActionResult> UpdateItem([FromBody] UpdateItemRequestModel request)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var item = await _context.Items
                .Include(i => i.Section)
                .SingleOrDefaultAsync(s => s.Id == request.Id);

            if (item == null)
                return NotFound();

            item.IsComplete = request.IsComplete;
            item.LastModified = DateTime.UtcNow;
            item.Section?.LastModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new UpdateItemModel {
                Id = item.Id,
                SectionId = item.Section?.Id,
                SectionLastModified = item.Section?.LastModified,
                ItemLastModified = item.LastModified,
                ItemIsComplete = item.IsComplete
            });
        }
    }
}