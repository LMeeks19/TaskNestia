namespace Server.Controllers.RequestObjects
{
    public class CreateSectionRequest
    {
        public string Name { get; set; } = null!;
        public int SheetId { get; set; }

    }
}
