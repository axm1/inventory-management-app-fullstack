using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace TuProyecto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private static readonly string _connectionString = "Server=.\\SQLExpress;Database=Despensa;Trusted_Connection=True;TrustServerCertificate=true;";

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM usuarios WHERE NombreUsuario = @NombreUsuario AND Contraseña = @Contraseña";
                using (SqlCommand command = new SqlCommand(query, connection)) // Aquí se usa SqlCommand
                {
                    command.Parameters.AddWithValue("@NombreUsuario", model.NombreUsuario);
                    command.Parameters.AddWithValue("@Contraseña", model.Contraseña);

                    int count = (int)command.ExecuteScalar();

                    if (count > 0)
                    {
                        return Ok("Login exitoso");
                    }
                    else
                    {
                        return BadRequest("Nombre de usuario o contraseña incorrectos");
                    }
                }
            }
        }

        [HttpGet("select_productos")]
        public IActionResult GetProductos()
        {
            List<Producto> productos = new List<Producto>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT * FROM Producto";
                using (SqlCommand command = new SqlCommand(query, connection)) // Aquí se usa SqlCommand
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Producto producto = new Producto
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Codigo = reader["Codigo"].ToString(),
                                Nombre = reader["Nombre"].ToString(),
                                Precio = Convert.ToDecimal(reader["Precio"]),
                                Iva = Convert.ToDecimal(reader["Iva"])
                            };

                            productos.Add(producto);
                        }
                    }
                }
            }

            return Ok(productos);
        }
        //UPDATE PRODUCTO
        [HttpPut("id_producto_update={id}")]
        public IActionResult UpdateProducto(int id, [FromBody] Producto model)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "UPDATE Producto SET Codigo = @Codigo, Nombre = @Nombre, Precio = @Precio, Iva = @Iva WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@Codigo", model.Codigo);
                    command.Parameters.AddWithValue("@Nombre", model.Nombre);
                    command.Parameters.AddWithValue("@Precio", model.Precio);
                    command.Parameters.AddWithValue("@IVA", model.Iva);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Producto actualizado exitosamente");
                    }
                    else
                    {
                        return NotFound("No se encontró el producto");
                    }
                }
            }

        }

        //DELETE producto
        [HttpDelete("id_producto_delete={id}")]
        public IActionResult DeleteProducto(int id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "DELETE FROM Producto WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Producto eliminado exitosamente");
                    }
                    else
                    {
                        return NotFound("No se encontró el producto");
                    }
                }
            }
        }

        //INSERT producto
        [HttpPost("insert")]
        public IActionResult CreateProducto([FromBody] Producto model)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "INSERT INTO Producto (Codigo, Nombre, Precio, Iva) VALUES (@Codigo, @Nombre, @Precio, @Iva)";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Codigo", model.Codigo);
                    command.Parameters.AddWithValue("@Nombre", model.Nombre);
                    command.Parameters.AddWithValue("@Precio", model.Precio);
                    command.Parameters.AddWithValue("@Iva", model.Iva);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Producto creado exitosamente");
                    }
                    else
                    {
                        return BadRequest("No se pudo crear el producto");
                    }
                }
            }
        }

        // insert a la tabla recibos 
        [HttpPost("insert_recibo")]
        public IActionResult CreateRecibo([FromBody] Recibo model)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string query = "INSERT INTO recibos (fecha_recibo, monto_bruto, iva, monto_neto) VALUES (GETDATE(), @monto_bruto, @iva, @monto_neto)";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@monto_bruto", model.monto_bruto);
                    command.Parameters.AddWithValue("@iva", model.iva);
                    command.Parameters.AddWithValue("@monto_neto", model.monto_neto);

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Recibo creado exitosamente");
                    }
                    else
                    {
                        return BadRequest("No se pudo crear el recibo");
                    }
                }
            }
        }


        //nuevo buscador en la tabla de productos por codigo
        [HttpGet("select_productos_codigo={codigo}")]
        public IActionResult GetProductosCodigo(string codigo)
        {
            List<Producto> productos = new List<Producto>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = "SELECT * FROM Producto WHERE Codigo = @Codigo";
                using (SqlCommand command = new SqlCommand(query, connection)) // Aquí se usa SqlCommand
                {
                    command.Parameters.AddWithValue("@Codigo", codigo);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Producto producto = new Producto
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Codigo = reader["Codigo"].ToString(),
                                Nombre = reader["Nombre"].ToString(),
                                Precio = Convert.ToDecimal(reader["Precio"]),
                                Iva = Convert.ToDecimal(reader["Iva"])
                            };

                            productos.Add(producto);
                        }
                    }
                }
            }

            return Ok(productos);
        }

    }

    public class Recibo
    {

        public DateTime fecha_recibo { get; set; }
        public decimal monto_bruto { get; set; }
        public decimal iva { get; set; }
        public decimal monto_neto { get; set; }
    }

    public class LoginModel
    {
        public string NombreUsuario { get; set; }
        public string Contraseña { get; set; }
    }

    public class Producto
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public decimal Iva { get; set; }
    }
}

