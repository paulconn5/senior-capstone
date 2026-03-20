namespace UC_ConnectIT.Server.Models
{
    public class UserDegree
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int DegreeId { get; set; }
        public Degree Degree { get; set; }

        public string DegreeLevel { get; set; } = string.Empty;
    }
}