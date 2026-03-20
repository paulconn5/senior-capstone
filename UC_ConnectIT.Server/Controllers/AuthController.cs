using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("onboarding")]
        public async Task<IActionResult> Onboarding(OnboardingDTO request)
        {
            try
            {
                // Check if email already exists
                if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                    return BadRequest(new { message = "Email already exists." });

                //  Create user
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Role = request.Role,
                    GraduationDate = request.GraduationDate,
                    AboutMe = request.AboutMe,
                    IsEmailVerified = false
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                // Assign Degrees
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

                // Assign Tags 
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

                // Create email verification token
                var random = new Random();
                var token = random.Next(100000, 999999).ToString();

                _db.EmailVerificationTokens.Add(new EmailVerificationToken
                {
                    UserId = user.Id,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                });

                await _db.SaveChangesAsync();

                return Ok(new
                {
                    message = "User registered successfully.",
                    verificationToken = token
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { message = "Registration failed.", details = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials." });

            // If not verified, require verification
            if (!user.IsEmailVerified)
            {
                return Ok(new
                {
                    requiresVerification = true,
                    userId = user.Id
                });
            }

            // Generate JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role ?? "student")
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var expireMinutes = 60;
            int.TryParse(_config["Jwt:ExpireMinutes"], out expireMinutes);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = creds
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            // Return token and user info
            return Ok(new
            {
                requiresVerification = false,
                token = jwt,
                user = new
                {
                    Id = user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Role
                }
            });
        }

        [HttpPost("verify-token")]
        public async Task<IActionResult> VerifyToken([FromBody] VerifyTokenDTO request)
        {
            var tokenEntry = await _db.EmailVerificationTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t =>
                    t.UserId == request.UserId &&
                    t.Token == request.Token);

            if (tokenEntry == null || tokenEntry.ExpiresAt < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token." });

            tokenEntry.User.IsEmailVerified = true;

            _db.EmailVerificationTokens.Remove(tokenEntry);

            await _db.SaveChangesAsync();

            return Ok(new { message = "Account verified successfully." });
        }
    }
}
