using Server.Enums;

namespace Server.Models
{
    public class NestedEntityModel
    {
        public int Id { get; set; }
        public NestedEntityTypeEnum Type { get; set; }
        public int SheetId { get; set; }
        public string Name { get; set; } = null!;
        public DateTime LastModified { get; set; }
    }
}
