using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.DTOs;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MessagesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int userId)
        {
            var conversations = await _db.Conversations
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .Include(c => c.User1)
                .Include(c => c.User2)
                .OrderByDescending(c => c.LastMessageAt)
                .ToListAsync();

            var result = new List<ConversationResponseDTO>();
            foreach (var c in conversations)
            {
                var otherUser = c.User1Id == userId ? c.User2 : c.User1;
                var lastMsg = await _db.Messages
                    .Where(m => m.ConversationId == c.Id)
                    .OrderByDescending(m => m.SentAt)
                    .FirstOrDefaultAsync();
                var unread = await _db.Messages
                    .CountAsync(m => m.ConversationId == c.Id
                        && m.SenderId != userId && !m.IsRead);

                result.Add(new ConversationResponseDTO
                {
                    Id = c.Id,
                    OtherUserId = otherUser.Id,
                    OtherUserName = $"{otherUser.FirstName} {otherUser.LastName}",
                    LastMessage = lastMsg?.Content,
                    LastMessageAt = lastMsg?.SentAt,
                    UnreadCount = unread
                });
            }

            return Ok(result);
        }

        [HttpGet("conversations/{conversationId}")]
        public async Task<IActionResult> GetMessages(int conversationId, [FromQuery] int userId)
        {
            var convo = await _db.Conversations.FindAsync(conversationId);
            if (convo == null) return NotFound();
            if (convo.User1Id != userId && convo.User2Id != userId)
                return Forbid();

            var messages = await _db.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageResponseDTO
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.FirstName + " " + m.Sender.LastName,
                    Content = m.Content,
                    SentAt = m.SentAt,
                    IsRead = m.IsRead
                })
                .ToListAsync();

            // Mark unread messages from the other user as read
            var unreadMessages = await _db.Messages
                .Where(m => m.ConversationId == conversationId
                    && m.SenderId != userId && !m.IsRead)
                .ToListAsync();
            foreach (var m in unreadMessages) m.IsRead = true;
            await _db.SaveChangesAsync();

            return Ok(messages);
        }

        [HttpPost("conversations")]
        public async Task<IActionResult> CreateOrGetConversation([FromBody] CreateConversationDTO dto)
        {
            // Normalize: always store smaller userId as User1Id
            var u1 = Math.Min(dto.UserId, dto.OtherUserId);
            var u2 = Math.Max(dto.UserId, dto.OtherUserId);

            var existing = await _db.Conversations
                .FirstOrDefaultAsync(c => c.User1Id == u1 && c.User2Id == u2);

            if (existing != null)
                return Ok(new { conversationId = existing.Id });

            var convo = new Conversation
            {
                User1Id = u1,
                User2Id = u2
            };
            _db.Conversations.Add(convo);
            await _db.SaveChangesAsync();

            return Ok(new { conversationId = convo.Id });
        }
    }
}
