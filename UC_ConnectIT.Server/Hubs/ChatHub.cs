using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.DTOs;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly AppDbContext _db;

        public ChatHub(AppDbContext db)
        {
            _db = db;
        }

        private int? GetUserIdFromClaims()
        {
            var id = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(id, out var parsed)) return parsed;
            return null;
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
            var senderId = GetUserIdFromClaims();
            if (senderId == null) return;

            var conversation = await _db.Conversations.FindAsync(dto.ConversationId);
            if (conversation == null) return;

            if (conversation.User1Id != senderId.Value && conversation.User2Id != senderId.Value)
                return;

            var message = new Message
            {
                ConversationId = dto.ConversationId,
                SenderId = senderId.Value,
                Content = dto.Content,
                SentAt = DateTime.UtcNow
            };

            _db.Messages.Add(message);
            conversation.LastMessageAt = message.SentAt;
            await _db.SaveChangesAsync();

            var sender = await _db.Users.FindAsync(senderId.Value);

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

        public async Task MarkAsRead(int conversationId)
        {
            var userId = GetUserIdFromClaims();
            if (userId == null) return;

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
