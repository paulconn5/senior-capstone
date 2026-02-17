namespace UC_ConnectIT.Server.DTOs
{
    public class SendMessageDTO
    {
        public int SenderId { get; set; }
        public int ConversationId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
