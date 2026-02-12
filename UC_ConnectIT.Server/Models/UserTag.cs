namespace UC_ConnectIT.Server.Models
{
    public class UserTag
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }

}
