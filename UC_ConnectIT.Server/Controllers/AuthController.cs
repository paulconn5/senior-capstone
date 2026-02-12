using BCrypt.Net;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Data;
using UC_ConnectIT.Server.DTOs;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("onboarding")]
        public async Task<IActionResult> Onboarding(OnboardingDTO request)
        {
            try
            {
                // 1Check if email already exists
                if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                    return BadRequest(new { message = "Email already exists." });

                // 2Create new user
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Role = request.Role,
                    Degree = request.Degree,
                    DegreeLevel = request.DegreeLevel,
                    GraduationDate = request.GraduationDate,
                    AboutMe = request.AboutMe,
                    IsEmailVerified = false
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync(); 

                // Handle tags / skills 
                if (request.Tags != null && request.Tags.Count > 0)
                {
                    foreach (var tagName in request.Tags)
                    {
                        // Check if tag exists
                        var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Name == tagName);
                        if (tag == null)
                        {
                            tag = new Tag { Name = tagName };
                            _db.Tags.Add(tag);
                            await _db.SaveChangesAsync(); // generate tag.Id
                        }

                        // Create UserTag link
                        var userTag = new UserTag
                        {
                            UserId = user.Id,
                            TagId = tag.Id
                        };
                        _db.UserTags.Add(userTag);
                    }

                    await _db.SaveChangesAsync();
                }

                // Create email verification token
                var token = Guid.NewGuid().ToString();
                _db.EmailVerificationTokens.Add(new EmailVerificationToken
                {
                    UserId = user.Id,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });

                await _db.SaveChangesAsync();

                // 5️⃣ For testing: output link in console
                Console.WriteLine($"Verification link: https://localhost:5173/verify-email?token={token}");

                
                return Ok(new { message = "User registered. Check email to verify account." });
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine(ex);
                return StatusCode(500, new { message = "Registration failed.", details = ex.Message });
            }
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Role
            });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            //Find the token in the database
            var tokenEntry = await _db.EmailVerificationTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token);

            if (tokenEntry == null || tokenEntry.ExpiresAt < DateTime.UtcNow)
                return BadRequest("Invalid or expired token");

            // Mark the user as verified
            tokenEntry.User.IsEmailVerified = true;

            // delete the token now that it's used
            _db.EmailVerificationTokens.Remove(tokenEntry);

            await _db.SaveChangesAsync();

            return Ok(new { message = "Email verified successfully." });
        }

    }
}
