import React, {useEffect, useState, useRef} from 'react';
import {nanoid} from 'nanoid';
import {Tooltip, Dialog} from '@material-ui/core';
import {obtenerProductos, crearProducto, editarProducto, eliminarProducto} from '../../utils/api.js';
import PrivateComponent from '../../components/PrivateComponent.jsx'

const Productos = () => {
    
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [celulares, setCelulares] = useState([]);
    const [textoBoton, setTextoBoton] = useState('Crear Producto');
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

    useEffect(() => {
        if (ejecutarConsulta) {
            obtenerProductos(
                (response) => {
                    setCelulares(response.data);
                    setEjecutarConsulta(false);
                },
                (error) => {
                    console.error(error);
                }
            );   
        }
    } ,[ejecutarConsulta])

    useEffect(()=>{
        if(mostrarTabla) {
            setTextoBoton('Crear Producto');
        } else {
            setTextoBoton('Mostrar Productos');
        }
    },[mostrarTabla]);
    
    return (
      <div className='flex h-full w-full flex-col items-center justify-start p-8'>
          <div className='flex flex-col w-full'>
            <h2 className='text-3xl font-extrabold text-gray-900'>Página de Administración de Productos</h2>
            <PrivateComponent roleList = {['admin']}>
            <button onClick={() => {
                setMostrarTabla(!mostrarTabla);
            }}
                className='p-5 text-white bg-indigo-500 rounded-full m-6 w-28 self-end'>
                    {textoBoton}
                </button>
            </PrivateComponent>
        </div>
          {mostrarTabla ? (<TablaCelulares listaCelulares={celulares}/>
          ) : (
            <FormularioCreacionCelulares 
            setMostrarTabla = {setMostrarTabla}
            listaCelulares = {celulares}
            setCelulares={setCelulares}/>)}    
      </div>
    );
;}

const TablaCelulares=({listaCelulares})=>{

const [busqueda, setBusqueda] = useState('');
const [celularesFiltrados, setCelularesFiltrados] = useState(listaCelulares);

useEffect(() => {
    setCelularesFiltrados(
        listaCelulares.filter((elemento) => {
        return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
        })
    );
}, [busqueda, listaCelulares])
   
    return(
        <div className='flex flex-col items-center justify-center w-full'>
            <input 
            placeholder='Buscar...' 
            className='border-2 border-gray-700 px-3 py-1 self-start rounded-md'
            value={busqueda}
            onChange= {(e) => setBusqueda(e.target.value)}
            />
            <h2 className='text-2xl font-extrabold text-gray-800'>Todos los Productos</h2>
            
                <table className='tabla'>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <PrivateComponent roleList = {['admin']}>
                                <th>Acciones</th>
                            </PrivateComponent>
                        </tr>
                    </thead>
                    <tbody>
                        {celularesFiltrados.map((celular) =>{
                            return(
                            <FilaProducto key={nanoid()} celular={celular} />
                            )
                        })}
                    </tbody>
                </table>
            
        </div>
    );
};

const FilaProducto = ({celular, setEjecutarConsulta}) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [infoNuevoCelular, setInfoNuevoCelular] = useState({
        _id: celular._id,
        descripcion: celular.descripcion,
        precio: celular.precio,
        estado: celular.estado
    })
    
    const actualizarCelular = async () => {
        
        await editarProducto(
            celular._id, 
            {
            descripcion: infoNuevoCelular.descripcion,
            precio: infoNuevoCelular.precio,
            estado: infoNuevoCelular.estado
        }, 
            (response) => {
                setEdit(false)
                setEjecutarConsulta(true)
            }, 
            (error) => {
                console.error(error)
            })
        
    };

    const eliminarVenta = async () => {
        await eliminarProducto(celular._id, (response) => {
            console.log(response.data);
            setEjecutarConsulta(true)
        }, (error) =>{
            console.error(error);
        });

        setOpenDialog(false);
    };

    return (
        <tr>
            {edit ? (
            <>
                <td>{celular._id}</td>
                <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="text" 
                    value={infoNuevoCelular.descripcion}
                    onChange={(e) => setInfoNuevoCelular({...infoNuevoCelular, descripcion:e.target.value})}
                    />
                </td>
                 <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="text" 
                    
                    value={infoNuevoCelular.precio}
                    onChange={(e) => setInfoNuevoCelular({...infoNuevoCelular, precio:e.target.value})} 
                    />
                </td>
                <td>
                <select 
                    required
                    name='estado' 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                    defaultValue=''
                    value={infoNuevoCelular.estado}
                    onChange={(e) => setInfoNuevoCelular({...infoNuevoCelular, estado:e.target.value})}>
                       <option disabled value=''>Selecciona</option>
                       <option>Disponible</option>
                       <option>No Disponible</option>
                   </select>
                    
                    {/* <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="text" 
                    value={infoNuevoCelular.estado}
                    onChange={(e) => setInfoNuevoCelular({...infoNuevoCelular, estado:e.target.value})}
                    /> */}
                </td>
            </>
            ) : (
                <>
                <td>{celular._id}</td>
                <td>{celular.descripcion}</td>
                <td>{celular.precio}</td>
                <td>{celular.estado}</td>
                </>  
            )}
        <PrivateComponent roleList = {['admin']}>
        <td>   
            <div className='flex w-full justify-around'>
                {edit ? (
                <> 
                    <Tooltip title='Confirmar' arrow>
                        <i className='fas fa-check text-green-700 hover:text-green-500'
                        onClick={() => actualizarCelular()}/>
                    </Tooltip>
                    <Tooltip title='Cancelar' arrow>
                    <i 
                    onClick={() => setEdit(!edit)}
                    className='fas fa-ban' />
                    </Tooltip>
                </> 
            ):(
                <>
                <Tooltip title='Editar' arrow>
                    <i 
                    onClick={() => setEdit(!edit)}
                    className='fas fa-pencil-alt' />
                </Tooltip>        
                <Tooltip title='Eliminar' arrow>
                <i 
                onClick ={() => setOpenDialog(true)}
                className='fas fa-trash text-red-500 hover:text-red-900' />
                </Tooltip>
                </>
            )}        
            </div>
            <Dialog open={openDialog}>
                <div className='p-8'>
                    <h1 className='text-gray-900 text-2xl font-bold'>¿Está seguro de eliminar la venta?</h1>
                    <div className='flex w-full justify-center items-center my-4'>
                        <button 
                        onClick={() => eliminarVenta()}
                        className = 'mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md'>SI</button>
                        <button 
                        onClick={() => setOpenDialog(false)}
                        className = 'mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'>NO</button>
                    </div>
                </div>
            </Dialog>
        </td>
        </PrivateComponent>
    </tr>
    )
}

const FormularioCreacionCelulares=({setMostrarTabla, listaCelulares, setCelulares})=>{
    
    const form = useRef(null);
   
    const submitForm = (e) =>{
        e.preventDefault();
        const fd = new FormData(form.current);
    
        const nuevoProducto = {};
        fd.forEach((value, key) => {
            nuevoProducto[key] = value;
        });

        crearProducto({
            id: nuevoProducto._id,
            descripcion: nuevoProducto.descripcion,
            precio: nuevoProducto.precio,
            estado: nuevoProducto.estado
        }, (response)=>{
            console.log(response.data);
        }, (error) => {
            console.error(error)
        });

        setMostrarTabla(true);
        setCelulares([...listaCelulares, nuevoProducto]);
    };
        
   
    return(
        <div className='flex flex-col items-center justify-center'>
            <h2 className='text-2xl font-extrabold text-gray-800'>Crear Nuevo Producto</h2>
            <form ref={form} onSubmit= {submitForm} className='flex flex-col'>
                <label className='flex flex-col' htmlFor="descripcion">
                    Descripción Producto
                    <input
                    name='descripcion' 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                    type="text"
                    placeholder='Celular'
                    required/> 
                </label>
                <label className='flex flex-col' htmlFor="precio">
                    Precio Producto
                    <input
                    required
                    name='precio'
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                    type="text"
                    placeholder='$1.000.000'
                    /> 
                </label>
                <label className='flex flex-col' htmlFor="estado">
                    Estado Producto
                   <select 
                   required
                   name='estado' 
                   className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                   defaultValue=''>
                       <option disabled value= ''>Selecciona</option>
                       <option>Disponible</option>
                       <option>No Disponible</option>
                   </select>
                </label>
                <button type='submit'
                className='col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white'
             >
                    Guardar Datos</button>
            </form>
        </div>
    )
};

export default Productos;
