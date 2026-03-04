using Microsoft.EntityFrameworkCore;
using Server.Enums;
using Server.Objects;

namespace Server.Database
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Sheet> Sheets { get; set; }
        public DbSet<NestedEntity> NestedEntities { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Item> Items { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ================================
            // PRIMARY KEYS (explicit for clarity)
            // ================================

            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Id)
                .IsUnique();

            modelBuilder.Entity<Sheet>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<Sheet>()
                .HasIndex(u => u.Id)
                .IsUnique();

            modelBuilder.Entity<NestedEntity>()
                .HasKey(e => e.Id);

            modelBuilder.Entity<NestedEntity>()
                .HasIndex(u => u.Id)
                .IsUnique();

            // ================================
            // TPH (Section + Item in one table)
            // ================================

            modelBuilder.Entity<NestedEntity>()
                .HasDiscriminator<NestedEntityTypeEnum>("Type")
                .HasValue<Section>(NestedEntityTypeEnum.Section)
                .HasValue<Item>(NestedEntityTypeEnum.Item);

            // Optional index on discriminator (useful for large tables)
            modelBuilder.Entity<NestedEntity>()
                .HasIndex("Type");

            // ================================
            // USER → SHEETS (Cascade Down)
            // ================================

            modelBuilder.Entity<User>()
                .HasMany(u => u.Sheets)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasIndex(U => U.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Sheet>()
                .HasIndex(s => s.UserId);

            // ================================
            // SHEET → NESTED ENTITIES (Cascade Down)
            // ================================

            modelBuilder.Entity<Sheet>()
                .HasMany(s => s.NestedEntities)
                .WithOne(e => e.Sheet)
                .HasForeignKey(e => e.SheetId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NestedEntity>()
                .HasIndex(e => e.SheetId);

            // ================================
            // SECTION → ITEMS (Cascade Down)
            // ================================

            modelBuilder.Entity<Section>()
                .HasMany(s => s.Items)
                .WithOne(i => i.Section)
                .HasForeignKey(i => i.SectionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Item>()
                .HasIndex(i => i.SectionId);

            // ================================
            // PROPERTY CONFIGURATION (optional but good practice)
            // ================================

            modelBuilder.Entity<Sheet>()
                .Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<NestedEntity>()
                .Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Item>()
                .Property(i => i.Description)
                .IsRequired()
                .HasMaxLength(100);
        }
    } 
}
