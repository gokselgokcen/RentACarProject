using Microsoft.EntityFrameworkCore;
using RentACarApi.Models;

namespace RentACarApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<Rental> Rentals { get; set; }

        public DbSet<User> Users { get; set; }


        // Fluent API örnekleri istersen buraya eklenir
    }
}
