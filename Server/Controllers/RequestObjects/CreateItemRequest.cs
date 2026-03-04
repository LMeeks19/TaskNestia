namespace Server.Controllers.RequestObjects
{
    public class CreateItemRequest
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int SheetId { get; set; }
        public int? SectionId { get; set; }

    }
}
