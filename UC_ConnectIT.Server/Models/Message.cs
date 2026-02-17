using System.ComponentModel.DataAnnotations;

namespace UC_ConnectIT.Server.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        [Required]
        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}
