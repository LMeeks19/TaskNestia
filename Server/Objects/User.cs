using TaskNestia.Server.Enums;

namespace TaskNestia.Server.Objects
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public UserRoleEnum Role { get; set; } = UserRoleEnum.User;
    }
}
