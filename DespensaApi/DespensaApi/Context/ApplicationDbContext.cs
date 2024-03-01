using Microsoft.EntityFrameworkCore;
using DespensaApi.Models;
namespace DespensaApi.Context
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<Producto> producto {  get; set; }

        public DbSet<Producto> LoginRequest { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base (options)
        {

        }
    }
    
}
