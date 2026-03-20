namespace UC_ConnectIT.Server.Models
{
    public class TagSubcategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Foreign key → TagCategory
        public int TagCategoryId { get; set; }
        public TagCategory TagCategory { get; set; }

        // Relationships
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public ICollection<Degree> Degrees { get; set; } = new List<Degree>();
    }
}