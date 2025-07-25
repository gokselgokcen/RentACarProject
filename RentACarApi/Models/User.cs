namespace RentACarApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = "User"; // 🔥 Default olarak "User"
    }
}
