using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.DTOs;
using UC_ConnectIT.Server.Models;
using System.Security.Claims;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _db.Users
                .Include(u => u.UserTags)
                    .ThenInclude(ut => ut.Tag)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound();

            var result = new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Role,
                user.AboutMe,
                user.GraduationDate,
                user.CreatedAt,
                user.IsEmailVerified,
                tags = user.UserTags?.Select(ut => new { ut.Tag.Id, ut.Tag.Name }).ToList()
            };

            return Ok(result);
        }

        // PUT api/users/{id} - update profile (only owner)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(userIdClaim, out var callingUserId))
                return Unauthorized();

            // only allow users to update their own profile
            if (callingUserId != id)
                return Forbid();

            var user = await _db.Users
                .Include(u => u.UserTags)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            // Update name if provided (split full name)
            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                var parts = request.FullName.Trim().Split(' ', 2);
                user.FirstName = parts[0];
                user.LastName = parts.Length > 1 ? parts[1] : string.Empty;
            }

            if (!string.IsNullOrWhiteSpace(request.Role))
                user.Role = request.Role;

            if (request.GraduationDate.HasValue)
                user.GraduationDate = request.GraduationDate;

            if (!string.IsNullOrWhiteSpace(request.AboutMe))
                user.AboutMe = request.AboutMe;

            // Remove existing user tags
            var existingUserTags = _db.UserTags.Where(ut => ut.UserId == id);
            _db.UserTags.RemoveRange(existingUserTags);
            await _db.SaveChangesAsync();

            // Add new tags if any
            if (request.Tags != null && request.Tags.Count > 0)
            {
                foreach (var tagName in request.Tags.Distinct())
                {
                    var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                    if (tag == null)
                    {
                        tag = new Tag { Name = tagName };
                        _db.Tags.Add(tag);
                        await _db.SaveChangesAsync(); // ensure tag.Id is set
                    }

                    _db.UserTags.Add(new UserTag
                    {
                        UserId = user.Id,
                        TagId = tag.Id
                    });
                }
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "User updated successfully." });
        }
    }
}
