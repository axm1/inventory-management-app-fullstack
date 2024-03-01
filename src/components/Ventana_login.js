import React, { useState, useRef } from 'react';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';

export const VentanaLogin = () => { // Corregir el nombre de la función a VentanaLogin
  const passwordRef = useRef(null);
  const history = useHistory();

  const alternarVisibilidadContraseña = () => {
    const entradaContraseña = $(passwordRef.current);
    const tipoActual = entradaContraseña.attr('type');
    const nuevoTipo = tipoActual === 'password' ? 'text' : 'password';
    entradaContraseña.attr('type', nuevoTipo);
  };

  function iniciar_sesion(){
    var nombre_usuario_sesion = document.getElementById('nombre_usuario_input').value;
    var contraseña_sesion = document.getElementById('contraseña_input').value;
    if (nombre_usuario_sesion === '' || contraseña_sesion === '') {
      alert('Por favor, llena todos los campos');
      return;
    }
    fetch('https://localhost:44372/api/Productos/login', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreUsuario: nombre_usuario_sesion,
        contraseña: contraseña_sesion
      })
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      alert("Nombre de usuario o contraseña incorrectos");
      throw new Error('Error en la solicitud');
    })
    .then(data => {
      console.log(data);
      history.push('/Opciones_crud_o_pos');

      if (data === 'true') {
        console.log('Iniciaste sesión');
        
      } 
    })
    .catch(error => {
      
      console.error('Error:', error);
    });

  }

  return (
    <div className="contenedor_login">
      <h2>TechNest.com</h2>
      <form>
        <div className="contenedor_info_usuario">
          <input type="text" name="" required="" id="nombre_usuario_input"/>
          <label style={{ fontSize: 1.1 + 'rem' }}>Nombre de usuario</label>
        </div>

        <div className="contenedor_info_usuario">
          <input ref={passwordRef} type="password" name="" required="" id="contraseña_input"/>
          <span className="toggle-button" id="toggleButton" onClick={alternarVisibilidadContraseña}>👁️</span>
          <label style={{ fontSize: '1.1rem' }}>Contraseña</label>
        </div>
        <a href="#" onClick={ iniciar_sesion}>Ingresar</a>
      </form>
    </div>
  );
};
export default VentanaLogin;
