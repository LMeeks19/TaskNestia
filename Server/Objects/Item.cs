namespace Server.Objects
{
    public class Item : NestedEntity
    {
        public int? SectionId { get; set; }
        public virtual Section Section { get; set; }
        public string Description { get; set; } = null!;
        public bool IsComplete { get; set; } = false;
    }
}
