using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                .OrderByDescending(x => ((NestedEntityModel)x).LastModified)
                .ToList();


            return Ok(nestedEntityModels);
        }
    }
}
