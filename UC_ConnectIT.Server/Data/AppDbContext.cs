using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<EmailVerificationToken> EmailVerificationTokens => Set<EmailVerificationToken>();
    }
}
