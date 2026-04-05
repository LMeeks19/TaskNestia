using Server.Enums;

namespace Server.Controllers.RequestModels
{
    public class UploadDataRequestModel
    {
        public int SheetId { get; set; }
        public NestedEntityTypeEnum Type { get; set; }
        public string? SectionName { get; set; }
        public List<string> UploadData { get; set; } = [];
    }
}
