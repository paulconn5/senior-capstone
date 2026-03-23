using Microsoft.EntityFrameworkCore;
using UC_ConnectIT.Server.Models;

namespace UC_ConnectIT.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        // DbSets
        public DbSet<User> Users => Set<User>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<TagCategory> TagCategories => Set<TagCategory>();
        public DbSet<TagSubcategory> TagSubcategories => Set<TagSubcategory>();
        public DbSet<Degree> Degrees => Set<Degree>();

        public DbSet<UserTag> UserTags => Set<UserTag>();
        public DbSet<UserDegree> UserDegrees => Set<UserDegree>();

        public DbSet<EmailVerificationToken> EmailVerificationTokens => Set<EmailVerificationToken>();
        public DbSet<Conversation> Conversations => Set<Conversation>();
        public DbSet<Message> Messages => Set<Message>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserTags (Many-to-Many)
            modelBuilder.Entity<UserTag>()
                .HasKey(ut => new { ut.UserId, ut.TagId });

            modelBuilder.Entity<UserTag>()
                .HasOne(ut => ut.User)
                .WithMany(u => u.UserTags)
                .HasForeignKey(ut => ut.UserId);

            modelBuilder.Entity<UserTag>()
                .HasOne(ut => ut.Tag)
                .WithMany(t => t.UserTags)
                .HasForeignKey(ut => ut.TagId);

            // UserDegrees 
            modelBuilder.Entity<UserDegree>()
                .HasKey(ud => new { ud.UserId, ud.DegreeId });

            modelBuilder.Entity<UserDegree>()
                .HasOne(ud => ud.User)
                .WithMany(u => u.UserDegrees)
                .HasForeignKey(ud => ud.UserId);

            modelBuilder.Entity<UserDegree>()
                .HasOne(ud => ud.Degree)
                .WithMany(d => d.UserDegrees)
                .HasForeignKey(ud => ud.DegreeId);

            // Tag Hierarchy
            modelBuilder.Entity<TagSubcategory>()
                .HasOne(sc => sc.TagCategory)
                .WithMany(c => c.Subcategories)
                .HasForeignKey(sc => sc.TagCategoryId);

            modelBuilder.Entity<Tag>()
                .HasOne(t => t.TagSubcategory)
                .WithMany(sc => sc.Tags)
                .HasForeignKey(t => t.TagSubcategoryId);

            modelBuilder.Entity<Degree>()
                .HasOne(d => d.TagSubcategory)
                .WithMany(sc => sc.Degrees)
                .HasForeignKey(d => d.TagSubcategoryId);

            // Conversations
            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.User1)
                .WithMany()
                .HasForeignKey(c => c.User1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.User2)
                .WithMany()
                .HasForeignKey(c => c.User2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
                .HasIndex(c => new { c.User1Id, c.User2Id })
                .IsUnique();

            // Messages
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}