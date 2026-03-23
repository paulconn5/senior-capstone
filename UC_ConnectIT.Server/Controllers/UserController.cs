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
                .Include(u => u.UserDegrees)
                    .ThenInclude(ud => ud.Degree)
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
                careerTitle = user.CareerTitle,

                tags = user.UserTags?.Select(ut => new
                {
                    ut.Tag.Id,
                    ut.Tag.Name
                }).ToList(),

                degrees = user.UserDegrees?.Select(ud => new
                {
                    ud.Degree.Id,
                    ud.Degree.Name
                }).ToList()
            };

            return Ok(result);
        }

        // PUT api/users/{id} - update profile
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
                .Include(u => u.UserDegrees)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            // Update name 
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

            if (request.CareerTitle != null)
                user.CareerTitle = request.CareerTitle.Trim();

            if (!string.IsNullOrWhiteSpace(request.DegreeLevel))
                user.Role = user.Role; 

            // Remove existing user tags and degrees
            var existingUserTags = _db.UserTags.Where(ut => ut.UserId == id);
            _db.UserTags.RemoveRange(existingUserTags);

            var existingUserDegrees = _db.UserDegrees.Where(ud => ud.UserId == id);
            _db.UserDegrees.RemoveRange(existingUserDegrees);

            await _db.SaveChangesAsync();

            // Add new tags by ids if provided
            if (request.TagIds != null && request.TagIds.Count > 0)
            {
                var validTags = await _db.Tags
                    .Where(t => request.TagIds.Contains(t.Id))
                    .Select(t => t.Id)
                    .ToListAsync();

                foreach (var tagId in validTags)
                {
                    _db.UserTags.Add(new UserTag
                    {
                        UserId = user.Id,
                        TagId = tagId
                    });
                }

                await _db.SaveChangesAsync();
            }

            // Add new degrees by ids if provided
            if (request.DegreeIds != null && request.DegreeIds.Count > 0)
            {
                var validDegrees = await _db.Degrees
                    .Where(d => request.DegreeIds.Contains(d.Id))
                    .Select(d => d.Id)
                    .ToListAsync();

                foreach (var degreeId in validDegrees)
                {
                    _db.UserDegrees.Add(new UserDegree
                    {
                        UserId = user.Id,
                        DegreeId = degreeId
                    });
                }

                await _db.SaveChangesAsync();
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "User updated successfully." });
        }
    }
}