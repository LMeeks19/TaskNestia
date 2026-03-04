namespace Server.Controllers.RequestObjects
{
    public class UpdateItemRequest
    {
        public int Id { get; set; }
        public bool IsComplete { get; set; }
    }
}
