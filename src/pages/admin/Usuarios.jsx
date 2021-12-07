import { nanoid } from 'nanoid';
import React, {useState, useEffect} from 'react'
import {obtenerUsuarios, editarUsuario} from '../../utils/api.js'

const Usuarios = () => {
    
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            await obtenerUsuarios(
                (respuesta) => {
                    setUsuarios(respuesta.data);
                },
                (err) => {
                    console.log(err);
                }
            );
        };
        fetchUsuarios();
    }, []);
    
    return (
        <div className='flex h-full w-full flex-col items-center justify-start p-8'>
        <div className='flex flex-col w-full'>
        <h2 className='text-3xl font-extrabold text-gray-900'>Administración de Usuarios</h2>
        </div>
        <div>
            <table className = 'tabla'> 
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user)=>{
                        return(
                            <tr key={nanoid()}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <EstadoUsuarios user={user}/>
                                </td>
                                <td>
                                    <RolesUsuario user={user} />
                                </td>
                            </tr>
                        )
                        
                    })}
                </tbody>
            </table>
        </div>
    </div>
        
    )
}

const RolesUsuario = ({user}) => {
    const [rol, setRol] = useState(user.rol);
    
    useEffect (() => {
        const editUsuario = async () => {
            await editarUsuario(user._id, {rol},
                (res) => {
                    console.log(res);
                },
                (err) => {
                    console.log(err);
                });
        };
        if(user.rol !== rol) {
            editUsuario();
        }
    }, [rol])

    return(
        <select value={rol} onChange = {(e) => setRol(e.target.value)}>
            <option value="" disabled>Seleccion Rol</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="sin rol">Sin Rol</option>
        </select>
    )
} 

const EstadoUsuarios = ({user}) => {
    const [estado, setEstado] = useState(user.estado ?? '');

    useEffect(() => {
        const editUsuario = async () => {
            await editarUsuario(
                user._id,
                {estado},
                (res) => {
                    console.log(res);
                },
                (err) => {
                    console.error(err);
                }
            );
        };
        if(user.estado !== estado) {
            editUsuario();
        }
    }, [estado, user]);

    return (
        <select value={estado} onChange = {(e)=> setEstado(e.target.value)}>
            <option className='' value="" disabled>Selecciona Estado</option>
            <option className='text-green-400' value="autorizado">Autorizado</option>
            <option className='text-yellow-400'value="pendiente">Pendiente</option>
            <option className='text-red-400'value="rechazado">Rechazado</option>
        </select>
    )
}
export default Usuarios;
