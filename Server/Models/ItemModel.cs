namespace Server.Models
{
    public class ItemModel : NestedEntityModel
    {
        public int? SectionId { get; set; }
        public string Description { get; set; } = null!;
        public bool IsComplete { get; set; }
    }
}
