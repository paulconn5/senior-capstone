using System.ComponentModel.DataAnnotations;

namespace UC_ConnectIT.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Student";

        public string? AboutMe { get; set; }

        public int? GraduationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsEmailVerified { get; set; } = false;

        public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();

        public ICollection<UserDegree> UserDegrees { get; set; } = new List<UserDegree>();

        public string? CareerTitle { get; set; }
    }
}