// UC_ConnectIT.Server/Models/EmailVerificationToken.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UC_ConnectIT.Server.Models
{
    public class EmailVerificationToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; } = null!;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}
