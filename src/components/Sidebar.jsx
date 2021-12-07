import React, {useEffect, useState} from 'react';
import Logo from '../media/logo.jpg';
import {Link, useLocation} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import PrivateComponent from './PrivateComponent';

const Sidebar = () => {
    const { logout } = useAuth0();

    const cerrarSesion = () => {
        logout({ returnTo: window.location.origin });
        localStorage.setItem('token', null);        
    };

    return( 
    <nav className='w-72 bg-yellow-400 h-full flex flex-col p-4'>
        
        <img className='mx-auto h-40 w-alto p-2 m-2' src={Logo} alt="workflow" />
        
        <div className='my-4'>
        <Ruta icono='fas fa-car' ruta='/admin/productos' nombre='Productos'/>
        <Ruta icono='fas fa-cash-register' ruta='/admin/ventas' nombre='Ventas'/>
        <PrivateComponent roleList ={['admin']}>
        <Ruta icono='fas fa-users' ruta='/admin/usuarios' nombre='Usuarios'/> 
        </PrivateComponent> 
        </div>
       
        <button 
            className=
            'flex items-center p-1 my-2 hover:bg-gray-800 bg-black w-full text-white rounded-md'
            onClick={() => cerrarSesion()}>
            <i class="fas fa-sign-out-alt w-10"></i>
            Cerrar Sesión
        </button>
    
    </nav>
)};

const Ruta = ({icono, ruta, nombre}) => {
    
    const Location = useLocation();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if(Location.pathname.includes(ruta)) {
            setIsActive(true);
        } else { 
            setIsActive(false);
        }   
    }, [Location, ruta])
    
    
    return (
        <Link to={ruta}>
                <button className=
                    {`flex items-center p-1 my-2 hover:bg-indigo-900 
                    bg-${isActive ? 'indigo' : 'gray'}-700 w-full text-white rounded-md`}>
                <i className= {`${icono} w-10`}/>
                {nombre}
                </button> 
        </Link>
    )
}

export default Sidebar;