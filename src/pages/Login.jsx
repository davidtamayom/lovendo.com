import React from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className='flex flex-col w-full justify-center items-center'>
            <h2 className='m-3 text-center text-3xl font-extrabold text-gray-900'>
                Inicia Sesión en tu cuenta</h2>
            <form className='mt-8 max-w-md '>
                <div>
                    <input className=' appearance-none relative block w-full px-3 py-2 border border-gray-300 
                    text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm' 
                    type="email" placeholder="Tu Email" required/>
                    <input className=' appearance-none relative block w-full px-3 py-2 border border-gray-300 
                    text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm' 
                    type="password" placeholder="Contraseña" required />
                </div>
                <div className='flex justify-between'>
                    <div>
                        <label htmlFor="recuerdame">
                            <input name="recuerdame" type="checkbox" />
                            Recuérdame
                        </label>
                    </div>
                    <div>
                        <Link to='/'>
                        Olvidaste tu contraseña
                        </Link>
                    </div>
                </div>
                <div>
                    <Link to='/admin'>
                    <button type='submit'>
                        Iniciar Sesión
                    </button>
                    </Link>
                </div>
                <div>O</div>
                <div>
                    <button>Continua con Google</button>
                </div>
            </form>
        </div>
    )
};

export default Login;
