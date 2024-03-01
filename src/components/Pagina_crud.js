

import React, { useState, useEffect } from 'react';


export const Pagina_crud = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('https://localhost:44372/api/Productos/select_productos')
        .then(response => response.json())
        .then(data => setProductos(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
    
    function cambiaColor() {
        var tr = document.getElementsByTagName('tr');
        var filaSeleccionada = null; // Variable para almacenar la fila actualmente seleccionada
    
        for (var i = 0; i < tr.length; i++) {
            tr[i].addEventListener('click', function(event) {
                // Si el clic ocurrió dentro del tbody, cambia el color de la fila
                if (event.target.tagName === 'TD') {
                    // Si hay una fila seleccionada, la deselecciona
                    if (filaSeleccionada !== null) {
                        filaSeleccionada.style.backgroundColor = 'white';
                        filaSeleccionada.classList.remove('seleccionado');
                    }
                    // Marca la fila actual como seleccionada
                    this.style.backgroundColor = 'red';
                    this.classList.add('seleccionado');
                    filaSeleccionada = this; // Actualiza la fila seleccionada
                }
            });
        }
    }

    function mostrarPopupEliminarRegistro() {
        var popup = document.getElementById("popupEliminarRegitro");
        if (document.querySelector('.seleccionado')) {
            popup.style.display = "block";
        }
        else {
            alert("Debe seleccionar un registro para eliminarlo");
            }        
    }

    function cerrarPopupEliminarRegistro() {
        var popup = document.getElementById("popupEliminarRegitro");
        popup.style.display = "none";
    }
    function eliminarProducto() {
        // Aquí puedes agregar la lógica para eliminar el producto
        console.log("Producto eliminado");
        cerrarPopupEliminarRegistro();
    }

    function mostrarPopupEditarRegistro() {

        var popup = document.getElementById("popupEditarRegistro");

        if (document.querySelector('.seleccionado')) {
            popup.style.display = "block";
            
            //tomar el id del tr seleccionado
            
            //obtener los valores del tr seleccionado
            var codigo = document.querySelector('.seleccionado').children[0].innerText;
            var nombre = document.querySelector('.seleccionado').children[1].innerText;
            var precio = document.querySelector('.seleccionado').children[2].innerText;
            var iva = document.querySelector('.seleccionado').children[3].innerText;

            //llenar los inputs con los valores del tr seleccionado
            document.getElementById('codigoEdit').value = codigo;
            document.getElementById('nombreEdit').value = nombre;
            document.getElementById('precioEdit').value = precio;

            if (iva == "13%") {
                document.getElementById('ivaEdit').checked = true;
            } else {
                document.getElementById('ivaEdit').checked = false;
            }
            
            }
        else {
            alert("Debe seleccionar un registro para editar");
            }        

        
    }
    
    function cerrarPopupEditarRegistro() {
        var popup = document.getElementById("popupEditarRegistro");
        popup.style.display = "none";
    }

    function mostrarPopupNuevoRegistro() {
        var popup = document.getElementById("popupNuevoRegistro");
        popup.style.display = "block";

        
    }

    function cerrarPopupNuevoRegistro() {
        
        var popup = document.getElementById("popupNuevoRegistro");
        popup.style.display = "none";

        //limpiar los inputs
        document.getElementById('codigoNuevo').value = "";
        document.getElementById('nombreNuevo').value = "";
        document.getElementById('precioNuevo').value = "";
        document.getElementById('ivaNuevo').checked = false;
    }

    function agregar_nuevo_producto() {

        // obtener los valores de los inputs
        var codigo = document.getElementById('codigoNuevo').value;
        var nombre = document.getElementById('nombreNuevo').value;
        var precio = document.getElementById('precioNuevo').value;
        var iva = document.getElementById('ivaNuevo').checked;

        //si precio tiene letras o caracteres especiales, no se puede guardar
        if (isNaN(precio)) {
            alert("El precio no puede contener letras o caracteres especiales");
            return;
        }
        if (iva) {
            iva = 1;
        } else {
            iva = 0;
        }
        //pregunta si todos los campos estan llenos
        if (codigo == "" || nombre == "" || precio == "") {
            alert("Debe llenar todos los campos");
            return;
        }

        fetch('https://localhost:44372/api/Productos/insert', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 0,
            codigo: codigo,
            nombre: nombre,
            precio: precio,
            iva: iva
        })
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('There was a problem with your fetch operation:', error));

        //esperar un segundo para que se actualice la tabla
        setTimeout(() => {
            fetch('https://localhost:44372/api/Productos/select_productos')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error fetching data:', error));
        }, 200);

        cerrarPopupNuevoRegistro();
    }

    function aceptar_eliminacion_producto() {
        var id_producto_seleccionado = document.querySelector('.seleccionado').getAttribute('id');
        fetch('https://localhost:44372/api/Productos/id_producto_delete='+id_producto_seleccionado, {
        method: 'DELETE',
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
    .then(data => console.log(data))
    .catch(error => console.error('There was a problem with your fetch operation:', error));

    setTimeout(() => {
        fetch('https://localhost:44372/api/Productos/select_productos')
        .then(response => response.json())
        .then(data => setProductos(data))
        .catch(error => console.error('Error fetching data:', error));
    } , 200);

    cerrarPopupEliminarRegistro();
    //desseleccionar la fila
    document.querySelector('.seleccionado').style.backgroundColor = 'white';
    document.querySelector('.seleccionado').classList.remove('seleccionado');
    }

    function guardar_edicion_producto() {
        var precioVal = document.getElementById('precioEdit').value;
        
        if (isNaN(precioVal)) {
            alert("El precio no puede contener letras o caracteres especiales");
            return;
        }

        var id_producto_seleccionado = document.querySelector('.seleccionado').getAttribute('id');
        var edicion_iva = document.getElementById('ivaEdit').checked;
        if (edicion_iva) {
            edicion_iva = 1;
        } else {
            edicion_iva = 0;
        }
        fetch('https://localhost:44372/api/Productos/id_producto_update='+id_producto_seleccionado, {
        method: 'PUT',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id_producto_seleccionado,
            codigo: document.getElementById('codigoEdit').value,
            nombre: document.getElementById('nombreEdit').value,
            precio: precioVal,
            iva: edicion_iva
        })
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('There was a problem with your fetch operation:', error));
            
        setTimeout(() => {
            fetch('https://localhost:44372/api/Productos/select_productos')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error fetching data:', error));
        }, 200);
        //cerrar el popup
        cerrarPopupEditarRegistro();
        //desseleccionar la fila
        document.querySelector('.seleccionado').style.backgroundColor = 'white';
        document.querySelector('.seleccionado').classList.remove('seleccionado');
    }


    function volver_a_pagina_anterior() {
        window.history.back();
    }

    return (

        <div className='tabla_pos_container' >
            <button className="btn_tabla_pos boton_back" onClick={volver_a_pagina_anterior}>Volver</button>
            <table className ='tabla_pos' >
                <caption style={ { color: 'white' }}>Mantenimiento de productos
                <div className="botones-superiores">
                <button className="btn_tabla_pos" onClick={mostrarPopupNuevoRegistro}>Nuevo Artículo</button>
            </div>
                </caption>
                    <thead>
                        <tr>
                        <th scope="col" style={ { width: '15%' }} className ='texto_alineado_izquierda'>Código</th>
                        <th scope="col" style={ { width: '60%' }} className ='texto_alineado_izquierda'>Nombre</th>
                        <th scope="col" style={ { width: '10%' }}>Precio</th>
                        <th scope="col" style={ { width: '10%' }}>IVA</th>
                        <th scope="col" style={ { width: '10%' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id} onClick={cambiaColor} id={producto.id}>
                                <td className='texto_alineado_izquierda'>{producto.codigo}</td>
                                <td className='texto_alineado_izquierda'>{producto.nombre}</td>
                                <td className='texto_alineado_centro'>{producto.precio}</td>

                                <td className='texto_alineado_centro'>
                                {(() => {
                                    if (producto.iva == 1) {
                                        return "13%";
                                    } else {
                                        return "N/A";
                                    }
                                    
                                })()}
                                </td>
                                
                                <td className='texto_alineado_centro'>
                                {(() => {
                                    if (producto.iva == 1) {
                                        return (producto.precio * 1.13).toFixed(2);
                                    } else {
                                        return producto.precio;
                                    }

                                })()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="contenedor_btns_editar_y_borrar">
                    <button className="btn_tabla_pos" onClick={mostrarPopupEditarRegistro}>Editar</button>
                    <button className="btn_tabla_pos" onClick={mostrarPopupEliminarRegistro}>Eliminar</button>
                </div>

                <div id="popupEliminarRegitro" className="popupEliminarRegitro">
                    <div className="popup-content">
                        <span className="cerrarPopupBorrarRegistro" onClick={cerrarPopupEliminarRegistro}>&times;</span>
                        <h2>Desea eliminar el producto?</h2>
                        <div className="botonesEliminarProducto">
                            <button className="btn_tabla_pos" onClick={aceptar_eliminacion_producto}>Eliminar</button>
                            <button onClick={cerrarPopupEliminarRegistro} className="btn_tabla_pos">Cancelar</button>
                        </div>
                    </div>
                </div>

                <div id="popupEditarRegistro" className="popupEliminarRegitro">
                    <div className="popup-content">
                        <span className="cerrarPopupBorrarRegistro" onClick={cerrarPopupEditarRegistro}>&times;</span>
                        <h2>Editar producto</h2>
                        <div>
                        <div className="form-group">
                            <label htmlFor="codigoEdit" className="labelEditarProducto">Código:</label>
                            <input type="text" id="codigoEdit" name="codigoEdit" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombreEdit" className="labelEditarProducto">Nombre:</label>
                            <input type="text" id="nombreEdit" name="nombreEdit" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="precioEdit" className="labelEditarProducto">Precio:</label>
                            <input type="text" id="precioEdit" name="precioEdit" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ivaEdit" className="labelEditarProducto" >Aplica IVA 13%:</label>
                            <div className="inputEditarProducto anadirIvaEdit" id='anadirIvaEdit'><input type="checkbox" id="ivaEdit" name="ivaEdit" /></div>
                        </div>
                        <div className="botonesEliminarProducto">
                            <button className="btn_tabla_pos" onClick={guardar_edicion_producto}>Guardar</button>
                            <button onClick={cerrarPopupEditarRegistro} className="btn_tabla_pos">Cancelar</button>
                        </div>
                    </div>
                    </div>
                </div>

                <div id="popupNuevoRegistro" className="popupEliminarRegitro">
                    <div className="popup-content">
                        <span className="cerrarPopupBorrarRegistro" onClick={cerrarPopupNuevoRegistro}>&times;</span>
                        <h2>Nuevo producto</h2>
                        
                        <div>
                        <div className="form-group">
                            <label htmlFor="codigoNuevo" className="labelEditarProducto">Código:</label>
                            <input type="text" id="codigoNuevo" name="codigoNuevo" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombreNuevo" className="labelEditarProducto">Nombre:</label>
                            <input type="text" id="nombreNuevo" name="nombreNuevo" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="precioNuevo" className="labelEditarProducto">Precio:</label>
                            <input type="text" id="precioNuevo" name="precioNuevo" className='inputEditarProducto' />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ivaNuevo" className="labelEditarProducto" >Aplica IVA 13%:</label>
                            <div className="inputEditarProducto anadirIvaNuevo" id='anadirIvaNuevo'><input type="checkbox" id="ivaNuevo" name="ivaNuevo" /></div>
                        </div>
                        <div className="botonesEliminarProducto">
                            <button className="btn_tabla_pos " onClick ={agregar_nuevo_producto}>Guardar</button>
                            <button onClick={cerrarPopupNuevoRegistro} className="btn_tabla_pos">Cancelar</button>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
    )
}

export default Pagina_crud
