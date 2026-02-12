// UC_ConnectIT.Server/Models/User.cs
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
        public string Role { get; set; } = "student"; // 'student' or 'mentor'

        public string? AboutMe { get; set; }

        public string? Degree { get; set; }

        public string? DegreeLevel { get; set; } // Associates, Bachelors, Masters, PhD

        public int? GraduationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsEmailVerified { get; set; } = false;

        public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();

    }
}
