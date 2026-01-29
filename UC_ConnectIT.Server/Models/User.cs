namespace UC_ConnectIT.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        // Auth
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public bool IsEmailVerified { get; set; }

        // Profile
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = null!; 
        public string? AboutMe { get; set; }
        public string? Degree { get; set; }
        public string? DegreeLevel { get; set; }
        public DateTime? ExpectedGraduation { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
