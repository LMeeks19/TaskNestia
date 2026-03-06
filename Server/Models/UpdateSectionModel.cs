namespace Server.Models
{
    public class UpdateSectionModel
    {
        public int Id { get; set; }
        public DateTime LastModified { get; set; }
        public bool IsComplete { get; set; }
    }
}
