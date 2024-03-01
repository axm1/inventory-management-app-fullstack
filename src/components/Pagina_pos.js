import React from 'react'

export const Pagina_pos = () => {
    
    function mostrarRecibo() {
        document.getElementById("popupRecibo").style.display = "block";
    
        // Tomar los datos de la tabla y mostrarlos en el recibo
        var tabla = document.querySelector(".tabla_pos tbody");
        var total = 0;
        var detalle = document.querySelector(".detalle tbody");
        detalle.innerHTML = "";
    
        for (var i = 0; i < tabla.rows.length; i++) {
            var fila = tabla.rows[i];
            // Verificar si hay suficientes celdas en la fila antes de acceder a sus propiedades
            if (fila.cells.length >= 6) {
                var producto = fila.cells[1].innerText;
                var precio = parseFloat(fila.cells[2].innerText);
                var cantidad = parseFloat(fila.cells[4].innerText);
                var iva = fila.cells[3].innerText;
                var totalProducto = parseFloat(fila.cells[5].innerText);
                total += totalProducto;
                totalProducto = totalProducto.toFixed(2);
                //sacar el iva de cada totalProducto
                if (iva === "13%") {
                    var ivaProducto = totalProducto * 0.13;
                    var ivaProducto = ivaProducto.toFixed(2);
                } else {
                    var ivaProducto = 0;
                }

                
                
                
                var filaDetalle = document.createElement("tr");
                filaDetalle.innerHTML = `
                    <td>${producto}</td>
                    <td>${precio}</td>
                    <td>${ivaProducto}</td>
                    <td>${cantidad}</td>
                    <td>${totalProducto}</td>
                `;
                detalle.appendChild(filaDetalle);
            } else {
                console.error("La fila no tiene suficientes celdas.");
            }
        }
    
        var totalElemento = document.querySelector(".total h3");
        totalElemento.innerText = "Total a pagar: $" + total.toFixed(2);
    }
    

    function cerrarRecibo(){
        document.getElementById("popupRecibo").style.display = "none";
    };

    function datetime_actual(){
        var dt = new Date();

        var date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

        return date ;
    }

    function obtenerTotales() {
        var totalPagar = 0;
        var totalIVA = 0;
        var totalSinIva = 0;
        var detalle = document.querySelector(".detalle tbody");
        
        // Iterar sobre las filas de la tabla de detalles del recibo
        detalle.querySelectorAll("tr").forEach(function(fila) {
            // Obtener los valores de precio, IVA y total de cada fila
            var precio = parseFloat(fila.querySelector("td:nth-child(2)").innerText);
            var iva = parseFloat(fila.querySelector("td:nth-child(3)").innerText);
            var totalProducto = parseFloat(fila.querySelector("td:nth-child(5)").innerText);
            var cantidad = parseFloat(fila.querySelector("td:nth-child(4)").innerText);
            // Sumar el total de la fila al total a pagar
            totalPagar += totalProducto;
            // sumar los iva de cada producto
            totalIVA += iva;
            
            totalSinIva = totalPagar - totalIVA;
        });
        // Obtener la fecha actual en formato ISO y luego convertirlo a cadena
        var fechaFormateada = new Date().toISOString();
        // Cortar la cadena para eliminar la parte que no necesitas
        fechaFormateada = fechaFormateada.slice(0, -1);
        
        // Obtener la fecha actual
        var fechaActual = new Date();

        // Asegurarse de que la fecha esté dentro del rango de SQL Server
        var fechaFormateada = new Date(Math.max(fechaActual, new Date('1753-01-01T00:00:00Z')));
        fechaFormateada = fechaFormateada.toISOString();
        
        var totales = {
            totalPagar: totalPagar.toFixed(2),
            totalIVA: totalIVA.toFixed(2),
            totalSinIva: totalSinIva.toFixed(2),
            fecha: fechaFormateada
        };
        return totales;
    }
    
    // Ejemplo de uso
    

    function inserta_recibo(){  
        
        var totales = obtenerTotales();
        console.log(totales);
        var totalPagar_recibo = totales.totalPagar;
        var totalIVA_recibo = totales.totalIVA;
        var totalSinIva_recibo = totales.totalSinIva;
        var fecha_recibo = totales.fechaFormateada;

        //si no hay productos en la tabla, no se puede insertar el recibo
        if (totalPagar_recibo === "0.00") {
            alert("No se puede insertar un recibo sin productos.");
            return;
        }
        
        fetch('https://localhost:44372/api/Productos/insert_recibo', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            
            monto_bruto: totalSinIva_recibo,
            iva: totalIVA_recibo,
            monto_neto: totalPagar_recibo
            
        })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }

        )
        .then(data => {
            console.log(data);
        }
        )
        .catch(error => console.error('Hubo un problema con la operación fetch:', error));

        // Limpiar la tabla
        var tabla = document.querySelector(".tabla_pos tbody");
        tabla.innerHTML = "";
        // Cerrar el recibo
        document.getElementById("popupRecibo").style.display = "none";
        // Limpiar el input de código de artículo
        document.getElementById("codigo_articulo").value = "";
        //limpiar el input de nombre de articulo
        document.getElementById("nombre_articulo").value = "";
        // Limpiar el input de cantidad
        document.getElementById("cantidad_articulos").value = "";
        // Mostrar un mensaje de éxito
        alert("El recibo se ha pagado y ha sido registrado en la base de datos.");

    }


    function buscar_articulo(texto_buscar){
        try {
            var texto_buscar = document.getElementById("codigo_articulo").value;
        }
        catch (error) {
            console.error('Hubo un problema con la operación fetch:', error);
        }
        fetch('https://localhost:44372/api/Productos/select_productos_codigo=' + texto_buscar, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
            })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            })
            .then(data => {
                // Verificar si se encontró un artículo
                if (data && data.length > 0) {
                    // Obtener el nombre del primer artículo encontrado
                    var nombreArticulo = data[0].nombre;
                    // Asignar el nombre del artículo al input
                    document.getElementById("nombre_articulo").value = nombreArticulo;
                } else {
                    // Si no se encontró ningún artículo, limpiar el valor del input
                    document.getElementById("nombre_articulo").value = "Nada encontrado";
                    console.log("No se encontró ningún artículo con el código especificado.");
                }
            })
            .catch(error => console.error('Hubo un problema con la operación fetch:', error));
        }
        //escritura en el input input_codigo_articulo el nombre del articulo encontrado en el fetch

        function Agregar_articulo(){
            // Obtener el valor del input de cantidad
            var cantidad = document.getElementById("cantidad_articulos").value;
            var articulo_a_agregar = document.getElementById("codigo_articulo").value;
            if (cantidad === "" || isNaN(cantidad)) {
                alert("La cantidad debe ser un número.");
                return;
            }
            fetch('https://localhost:44372/api/Productos/select_productos_codigo=' + articulo_a_agregar, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Verificar si se encontró un artículo
                if (data && data.length > 0) {
                    
                    // Obtener los datos del primer artículo encontrado
                    var articuloEncontrado = data[0];
                    if (articuloEncontrado.iva === 0) {
                        var iva = "Exento";
                        var total = articuloEncontrado.precio * cantidad;
                    }
                    else {
                        var iva = "13%";
                        var total = (articuloEncontrado.precio * cantidad) + (articuloEncontrado.precio * cantidad * 0.13);
                    }
                    // Crear una fila HTML para la tabla
                    var fila = document.createElement("tr");

                    // sacar total de precio mas 13% de iva
                    
                    total = total.toFixed(2);
                    // Insertar las celdas en la fila
                    fila.innerHTML = `
                        <td class='texto_alineado_izquierda'>${articuloEncontrado.codigo}</td>
                        <td class='texto_alineado_izquierda'>${articuloEncontrado.nombre}</td>
                        <td class='texto_alineado_centro'>${articuloEncontrado.precio}</td>
                        <td class='texto_alineado_centro'>${iva}</td>
                        <td class='texto_alineado_centro'>${cantidad}</td>
                        <td class='texto_alineado_derecha'>${total}</td>
                    `;
                    // Agregar la fila a la tabla
                    document.querySelector(".tabla_pos tbody").appendChild(fila);
                } else {
                    // Si no se encontró ningún artículo, mostrar una alerta
                    alert("No se encontró ningún artículo con el código especificado.");
                }
            })
            .catch(error => console.error('Hubo un problema con la operación fetch:', error));
        }
        

        //document.getElementById("cantidad_articulos").value = "1";

        buscar_articulo()

        function cerrar_recibo(){
            document.getElementById("popupRecibo").style.display = "none";
        }

        function volver_a_pagina_anterior() {
            window.history.back();
        }
    return (
        <div>
            <div className='tabla_pos_container' >
            <button className="btn_tabla_pos boton_back" onClick={volver_a_pagina_anterior}>Volver</button>
                <table className ='tabla_pos' >
                    <caption style={ { color: 'white' }}>
                       
                        Tienda y facturación 
                    <br/><br/><br/>
                    <div className="botones-superiores-pos">
                    <p>Código &nbsp; 
                        <input type="text" id="codigo_articulo" placeholder="Código" className="input_codigo_articulo" onKeyUp={buscar_articulo}/></p>
                        <p>Nombre artículo &nbsp; 
                        <input type="text" id="nombre_articulo" disabled placeholder="Nombre artículo" className="input_codigo_articulo" /></p>
                        <p>Cantidad &nbsp; 
                        <input type="text" id="cantidad_articulos" placeholder="Cantidad" className="input_codigo_articulo" /></p>
                        <p><button className="btn_agregar_articulo" onClick={Agregar_articulo}>Agregar</button></p>
                    </div>
                    </caption>
                        <thead>
                            <tr>
                            <th scope="col" style={ { width: '15%' }} className ='texto_alineado_izquierda'>Código</th>
                            <th scope="col" style={ { width: '50%' }} className ='texto_alineado_izquierda'>Nombre</th>
                            <th scope="col" style={ { width: '10%' }}>Precio</th>
                            <th scope="col" style={ { width: '10%' }}>IVA</th>
                            <th scope="col" style={ { width: '10%' }}>Cantidad</th>
                            <th scope="col" style={ { width: '10%' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                    <div className="contenedor_btns_editar_y_borrar">
                        <button className="btn_tabla_pos" id="mostrarRecibo" onClick={mostrarRecibo } >Imprimir</button>
                    </div>
            </div>

            <div id="popupRecibo" className="popupRecibo">
                <div className="recibo">
                    <div className="encabezado_recibo">
                    <h1>Recibo de Pago</h1>
                    <br/>
                    </div>
                    <div className="datos">

                    </div>
                    <div className="detalle">
                    <table>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>IVA</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    </div>
                    <div className="total">
                    <br/>
                    <h3>Total a pagar: $35.00</h3>
                    </div>
                    <br/>
                    <button className="botones_recibo" id="cerrarRecibo" onClick={cerrar_recibo}>Cerrar</button> &nbsp;&nbsp;
                    <button className="botones_recibo" id="pagar_recibo" onClick={inserta_recibo}>Pagar</button>
                </div>
            </div>
        </div>
    )
}

export default Pagina_pos
