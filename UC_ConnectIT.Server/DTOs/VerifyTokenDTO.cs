namespace UC_ConnectIT.Server.DTOs
{
    public class VerifyTokenDTO
    {
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
