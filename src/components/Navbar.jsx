import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Logo from '../media/logo.jpg';


const Navbar = () => {
    const { loginWithRedirect } = useAuth0();
    
    return (
        <nav className='bg-yellow-400'>
            <ul className='flex w-full justify-between my-3'>
                <li><img className='mx-auto h-20 w-alto p-2 m-2' src={Logo} alt="workflow" /></li>
                <li className='px-5'> 
                    <button 
                    onClick={() => loginWithRedirect()}
                    className='bg-indigo-600 p-2 text-white rounded-lg shadow-md hover:bg-indigo-900 m-2'>
                        Iniciar Sesión
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;