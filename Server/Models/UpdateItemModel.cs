namespace Server.Models
{
    public class UpdateItemModel
    {
        public int Id { get; set; }
        public int? SectionId { get; set; }
        public DateTime? SectionLastModified { get; set; }
        public DateTime ItemLastModified { get; set; }
        public bool ItemIsComplete { get; set; }
    }
}
