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
        public string Role { get; set; } = "student";

        public string? AboutMe { get; set; }

        public int? GraduationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsEmailVerified { get; set; } = false;

        // TAG RELATIONSHIP
        public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();

        // DEGREE RELATIONSHIP
        public ICollection<UserDegree> UserDegrees { get; set; } = new List<UserDegree>();

        // Mentor display-only field
        public string? CareerTitle { get; set; }
    }
}