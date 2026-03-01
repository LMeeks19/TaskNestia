using Server.Enums;

namespace Server.Objects
{
    public class User : Entity
    {
        public string Username { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public UserRoleEnum Role { get; set; } = UserRoleEnum.User;
    }
}
