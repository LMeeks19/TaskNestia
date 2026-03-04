namespace Server.Objects
{
    public class Section : NestedEntity
    {
        public virtual List<Item> Items { get; set; } = [];
    }
}
