namespace Server.Objects
{
    public class Sheet : Entity
    {
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public string Name { get; set; } = null!;
        public string HexColour { get; set; } = null!;
        public virtual List<NestedEntity> NestedEntities { get; set; } = [];
    }
}
