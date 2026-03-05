using Server.Enums;

namespace Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public UserRoleEnum Role { get; set; }
        public DateTime CreatedAt {  get; set; } 
    }
}
