using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.DTOs;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _db;

        public ChatHub(AppDbContext db)
        {
            _db = db;
        }

        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"convo-{conversationId}");
        }

        public async Task LeaveConversation(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"convo-{conversationId}");
        }

        public async Task SendMessage(SendMessageDTO dto)
        {
            var conversation = await _db.Conversations.FindAsync(dto.ConversationId);
            if (conversation == null) return;

            if (conversation.User1Id != dto.SenderId && conversation.User2Id != dto.SenderId)
                return;

            var message = new Message
            {
                ConversationId = dto.ConversationId,
                SenderId = dto.SenderId,
                Content = dto.Content,
                SentAt = DateTime.UtcNow
            };

            _db.Messages.Add(message);
            conversation.LastMessageAt = message.SentAt;
            await _db.SaveChangesAsync();

            var sender = await _db.Users.FindAsync(dto.SenderId);

            var response = new MessageResponseDTO
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                SenderName = sender != null ? $"{sender.FirstName} {sender.LastName}" : "Unknown",
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = false
            };

            await Clients.Group($"convo-{dto.ConversationId}")
                .SendAsync("ReceiveMessage", response);
        }

        public async Task MarkAsRead(int conversationId, int userId)
        {
            var unread = await _db.Messages
                .Where(m => m.ConversationId == conversationId
                    && m.SenderId != userId && !m.IsRead)
                .ToListAsync();

            foreach (var m in unread) m.IsRead = true;
            await _db.SaveChangesAsync();

            await Clients.Group($"convo-{conversationId}")
                .SendAsync("MessagesRead", conversationId, userId);
        }
    }
}
