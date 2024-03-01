using Microsoft.Extensions.Configuration;

namespace TuProyecto.API.Utilities
{
    public static class ConnectionUtility
    {
        public static string GetConnectionString(IConfiguration configuration)
        {
            return configuration.GetConnectionString("Server=.\\SQLExpress;Database=Despensa;Trusted_Connection=True;TrustServerCertificate=true;");
        }
    }
}
