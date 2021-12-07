import Login from './pages/Login';
import Registro from './pages/Registro';
import Usuarios from './pages/admin/Usuarios';
import Index from './pages/Index';
import Ventas from './pages/admin/Ventas';
import Productos from './pages/admin/Productos';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './styles/styles.css';
import AuthLayout from './layouts/AuthLayout';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import { Auth0Provider } from "@auth0/auth0-react";
import { UserContext } from './context/userContext.js';
import {useState} from 'react'
import PrivateComponent from './components/PrivateComponent.jsx';

function App() {
const [userData, setUserData] = useState({});

  return (
    <Auth0Provider
    domain="lovendocom.us.auth0.com"
    clientId="zPQtZZBp80Z7WDBZW669eXbefjCDi5kc"
    redirectUri={window.location.origin}
    audience = 'api-autenticacion-lovendo'
    >
      <UserContext.Provider value = {{userData, setUserData}} >
      <Router>
        <Switch> 
          <Route path={['/admin/usuarios', '/admin/productos', '/admin/Ventas']}>
            <PrivateLayout>
              <Switch>
              <Route path='/admin/productos'>
                  <Productos />
                </Route>
                <Route path='/admin/Ventas'>
                <PrivateComponent roleList ={['admin', 'vendedor']}>
                  <Ventas />
                </PrivateComponent>  
                </Route>
                <Route path='/admin/usuarios'>
                  <PrivateComponent roleList ={['admin']}>
                    <Usuarios />
                  </PrivateComponent>
                </Route>
              </Switch>
            </PrivateLayout>
          </Route>
          <Route path={['/login', '/registro']}>
            <AuthLayout>
              <Switch>
                <Route path='/login'>
                  <Login />
                </Route>
                <Route path='/registro'>
                  <Registro />
                </Route>
              </Switch>
            </AuthLayout>
          </Route>
          <Route path={['/']}>
            <PublicLayout>
              <Switch>
                <Route path='/'>
                  <Index />
                </Route>  
              </Switch>
            </PublicLayout>
          </Route>
        </Switch>
      </Router>
      </UserContext.Provider>
    </Auth0Provider>
  ) 
}

export default App;
