import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { VentanaLogin } from './Ventana_login';
import { Opciones_crud_o_pos } from './Opciones_crud_o_pos';
import { Pagina_pos } from './Pagina_pos';
import { Pagina_crud } from './Pagina_crud';
function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/" component={VentanaLogin} />
      <Route path="/Opciones_crud_o_pos" component={Opciones_crud_o_pos} />
      <Route path="/Pagina_pos" component={Pagina_pos} />
      <Route path="/Pagina_crud" component={Pagina_crud} />
    </Switch>
  </Router>
  );
}

export default App;