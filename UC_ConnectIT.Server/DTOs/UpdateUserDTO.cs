namespace UC_ConnectIT.Server.DTOs
{
    public class UpdateUserDTO
    {
        public string? FullName { get; set; }
        public string? Role { get; set; }
        public string? Degree { get; set; }
        public string? DegreeLevel { get; set; }
        public int? GraduationDate { get; set; }
        public string? AboutMe { get; set; }
        public List<string>? Tags { get; set; }
        public string? CareerTitle { get; set; }
    }
}
