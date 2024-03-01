--insert de usuario

INSERT INTO dbo.Usuarios (NombreUsuario, Contraseña) 
VALUES ('admin', 'admin123');


--insert de productos
INSERT INTO dbo.Producto (codigo, nombre, precio, iva) 
VALUES ('001', 'Producto 1', 10.99, 0);

-- Insertar el segundo producto con IVA
INSERT INTO dbo.Producto (codigo, nombre, precio, iva) 
VALUES ('002', 'Producto 2', 15.50, 1);

-- Insertar el tercer producto sin IVA
INSERT INTO dbo.Producto (codigo, nombre, precio, iva) 
VALUES ('003', 'Producto 3', 20.75, 0);