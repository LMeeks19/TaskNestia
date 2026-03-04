namespace Server.Objects
{
    public abstract class NestedEntity : Entity
    {
        public int SheetId { get; set; }
        public virtual Sheet Sheet { get; set; }
        public string Name { get; set; } = null!;
        public DateTime LastModified { get; set; } = DateTime.UtcNow;
    }
}
