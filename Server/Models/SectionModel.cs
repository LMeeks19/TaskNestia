namespace Server.Models
{
    public class SectionModel : NestedEntityModel
    {
        public List<ItemModel> Items { get; set; } = [];
    }
}
