using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.RequestModels;
using Server.Database;
using Server.Enums;
using Server.Models;
using Server.Objects;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NestedEntitiesController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [HttpGet("[action]/{sheetId}")]
        public async Task<IActionResult> GetNestedEntities(int sheetId)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var nestedEntities = await _context.NestedEntities
                .Where(ne => ne.SheetId == sheetId)
                .ToListAsync();

            var nestedItems = nestedEntities
                .OfType<Item>()
                .Where(i => i.SectionId != null)
                .Select(i => new ItemModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = NestedEntityTypeEnum.Item,
                    Description = i.Description,
                    LastModified = i.LastModified,
                    IsComplete = i.IsComplete,
                    SectionId = i.SectionId
                }).ToList();

            var sections = nestedEntities.OfType<Section>()
                .Select(s => new SectionModel
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = NestedEntityTypeEnum.Section,
                    LastModified = s.LastModified,
                    SheetId = s.SheetId,
                    Items = [.. nestedItems.Where(i => i.SectionId == s.Id)]
                }).ToList();

            var standaloneItems = nestedEntities
                .OfType<Item>()
                .Where(i => i.SectionId == null)
                .Select(i => new ItemModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    Type = NestedEntityTypeEnum.Item,
                    Description = i.Description,
                    LastModified = i.LastModified,
                    IsComplete = i.IsComplete,
                    SheetId = i.SheetId
                }).ToList();


            var nestedEntityModels = sections
                .Cast<object>()
                .Concat(standaloneItems)
                .ToList();


            return Ok(nestedEntityModels);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UploadNestedEntities([FromBody] UploadDataRequestModel request)
        {
            var username = User.Identity?.Name?.Split("\\")[1];

            if (!await _context.Users.AnyAsync(u => u.Username == username))
                return Unauthorized();

            var section = new Section
            {
                SheetId = request.SheetId,
                Name = request.SectionName!.Trim(),
                LastModified = DateTime.UtcNow
            };

            if (request.Type == NestedEntityTypeEnum.Section)
            {
                await _context.Sections.AddAsync(section);
                await _context.SaveChangesAsync();
            }

            var items = request.UploadData.Select(data => new Item
            {
                SheetId = request.SheetId,
                SectionId = request.Type == NestedEntityTypeEnum.Section ? section.Id : null,
                Name = data.Trim(),
                LastModified = DateTime.UtcNow,
                IsComplete = false
            });

            await _context.Items.AddRangeAsync(items);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
