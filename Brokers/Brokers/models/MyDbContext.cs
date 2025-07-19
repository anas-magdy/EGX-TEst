using Microsoft.EntityFrameworkCore;
namespace Brokers.models
{
    public class MyDbContext: DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options): base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Broker> Brokers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Broker>().ToTable("Broker");
        }
        
    }
}
