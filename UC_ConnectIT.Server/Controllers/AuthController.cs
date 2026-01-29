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

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO request)
        {
            if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email already exists.");

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
                IsEmailVerified = false
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok("User registered.");
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
    }
}
