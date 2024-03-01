import React, { useState, useRef } from 'react';
import imagenPos from './imagenesComponents/pos.png';
import imagenCrud from './imagenesComponents/crud.jpg';
import { useHistory } from 'react-router-dom';

export const Opciones_crud_o_pos = () => {
  const history1 = useHistory();

  function irAPos(){
    history1.push('/Pagina_pos');
  }

  function irACrud(){
    history1.push('/Pagina_crud');
  }

  function cerrarSesion(){
    history1.push('/');
  }
  return (
    <div className ="container" >

    <button className="logout-button" onClick={cerrarSesion}>
      <span className="logout-icon">🚪</span>
      Cerrar sesión
    </button>
      <div className="titulo">
        Bienvenido a TechNest.com <br></br>
        ¿Qué desea utilizar?
      </div>
      <div className="cuadrados">
        <div className="cuadrado" onClick={irACrud}>
          <img src={imagenCrud} alt="Descripción de la imagen" className='imagenesOpcionesCrudoPos' />
          <div className="rectangulo">
            <div className="texto">Admin de productos</div>
          </div>
        </div>

        <div className="cuadrado" onClick={irAPos}>
          <img src={imagenPos} alt="Descripción de la imagen" className='imagenesOpcionesCrudoPos'/>
          <div className="rectangulo">
            <div className="texto" >POS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Opciones_crud_o_pos
