public class OnboardingDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public List<int> DegreeIds { get; set; } = new();
    public string? DegreeLevel { get; set; }

    public int? GraduationDate { get; set; }
    public string AboutMe { get; set; } = string.Empty;

    public List<int> TagIds { get; set; } = new();
}