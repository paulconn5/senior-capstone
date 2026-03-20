namespace UC_ConnectIT.Server.Models
{
    public class Degree
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Link to subcategory
        public int TagSubcategoryId { get; set; }
        public TagSubcategory TagSubcategory { get; set; }

        public ICollection<UserDegree> UserDegrees { get; set; } = new List<UserDegree>();
    }
}