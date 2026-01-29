// UC_ConnectIT.Server/Models/RegisterDto.cs
namespace UC_ConnectIT.Server.Models
{
    public class RegisterDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Degree { get; set; }
        public string? DegreeLevel { get; set; }
        public DateTime? GraduationDate { get; set; }
    }
}
