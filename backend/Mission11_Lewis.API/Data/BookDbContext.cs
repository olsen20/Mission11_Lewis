using Microsoft.EntityFrameworkCore;

namespace Mission11_Lewis.API.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options) { }

        // Tables
        public DbSet<Book> Books { get; set; }
    }
}
