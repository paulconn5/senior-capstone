namespace UC_ConnectIT.Server.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<UserTag> UserTags { get; set; } = new List<UserTag>();
    }
}
