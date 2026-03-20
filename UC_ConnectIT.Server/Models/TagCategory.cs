namespace UC_ConnectIT.Server.Models
{
    public class TagCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<TagSubcategory> Subcategories { get; set; } = new List<TagSubcategory>();
    }
}