import React, {useEffect, useState, useRef} from 'react'
import {nanoid} from 'nanoid';
import {Tooltip, Dialog} from '@material-ui/core';
import {obtenerUsuarios, obtenerProductos, crearVenta, 
        editarVenta, obtenerVentas, eliminarVenta} from '../../utils/api.js';
import PrivateComponent from '../../components/PrivateComponent.jsx'

const Ventas = () =>{
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [ventas, setVentas] = useState([]);
    const [textoBoton, setTextoBoton] = useState('Crear Venta');
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

    useEffect(() => {
        if (ejecutarConsulta) {
            obtenerVentas(
                (response) => {
                    setVentas(response.data);
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
            setTextoBoton('Crear Venta');
        } else {
            setTextoBoton('Mostrar Ventas');
        }
    },[mostrarTabla]);

    return (
        <div className='flex h-full w-full flex-col items-center justify-start p-8'>
            <div className='flex flex-col w-full'>
              <h2 className='text-3xl font-extrabold text-gray-900'>Administración de Ventas</h2>
              <PrivateComponent roleList = {['admin', 'vendedor']}>
              <button onClick={() => {
                  setMostrarTabla(!mostrarTabla);
              }}
                  className='p-5 text-white bg-indigo-500 rounded-full m-6 w-28 self-end'>
                      {textoBoton}
                  </button>
              </PrivateComponent>
          </div>
            {mostrarTabla ? (<TablaVentas listaVentas = {ventas}/>
            ) : (
              <CreacionVentas 
                setMostrarTabla = {setMostrarTabla}
                listaVentas = {ventas}
                setVentas={setVentas}
              />)}    
        </div>
      );
  ;}

const TablaVentas = ({listaVentas}) => {
    const [busqueda, setBusqueda] = useState('');
    const [ventasFiltradas, setVentasFiltradas] = useState(listaVentas);

    useEffect(() => {
        setVentasFiltradas(
            listaVentas.filter((elemento) => {
            return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
            })
        );
    }, [busqueda, listaVentas])
        
    
    return (
        <div className='flex flex-col items-center justify-center w-full'>
            <input 
            placeholder='Buscar...' 
            className='border-2 border-gray-700 px-3 py-1 self-start rounded-md'
            value={busqueda}
            onChange= {(e) => setBusqueda(e.target.value)}
            />
            <h2 className='text-2xl font-extrabold text-gray-800'>Todos las Ventas</h2>
            
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Vendedor</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Doc Cliente</th>
                        <th>Venta Total</th>
                        <th>Estado</th>
                        <PrivateComponent roleList = {['admin']}>
                            <th>Acciones</th>
                        </PrivateComponent>
                    </tr>
                </thead>
                <tbody>
                    {ventasFiltradas.map((venta) =>{
                        return(
                        <FilaProductoTabla key={nanoid()} venta={venta} />
                        )
                    })}
                </tbody>
            </table>
        
    </div>
);
}

const FilaProductoTabla = ({venta, setEjecutarConsulta, formData}) => {

    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [infoNuevaVenta, setInfoNuevaVenta] = useState({
        _id: venta._id,
        vendedor: venta.vendedor,
        fecha: venta.fecha,
        cliente: venta.cliente,
        documento: venta.documento,
        tventa: venta.tventa,
        estado: venta.estado
    })

    const actualizarVenta = async () => {
        
        await editarVenta(
            venta._id, 
            {
            estado: infoNuevaVenta.estado
        }, 
            (response) => {
                setEdit(false)
                setEjecutarConsulta(true)
            }, 
            (error) => {
                console.error(error)
            })
        }
        
        const eliminarProducto = async () => {
            await eliminarVenta(venta._id, (response) => {
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
                    <td>{venta._id}</td>
                    <td>{venta.name}</td> 
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.documento}</td>
                    <td>{venta.tventa}</td>
                    <td>
                        <select 
                            required
                            name='estado' 
                            className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                            defaultValue=''
                            value={infoNuevaVenta.estado}
                            onChange={(e) => setInfoNuevaVenta({...infoNuevaVenta, estado:e.target.value})}>
                               <option disabled value=''>Selecciona</option>
                               <option>Entregada</option>
                                <option>En Proceso</option>
                                <option>Cancelada</option>
                           </select>
                        </td>
                    </>
                ) : (
                    <>
                    <td>{venta._id}</td>
                    <td>{venta.family_name}</td> 
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>{venta.documento}</td>
                    <td>{venta.tventa}</td>
                    <td>{venta.estado}</td>
                    </>  
                )}
            <PrivateComponent roleList = {['admin']}>
            <td>   
                <div className='flex w-full justify-around'>
                    {edit ? (
                    <> 
                        <Tooltip title='Confirmar' arrow>
                            <i className='fas fa-check text-green-700 hover:text-green-500'
                            onClick={() => actualizarVenta()}/>
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
                            onClick={() => eliminarProducto()}
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

const CreacionVentas = ({listaVentas, setVentas, setMostrarTabla}) => {
    
    const form = useRef(null);
    const [vendedores, setVendedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosTabla, setProductosTabla] = useState([]);
    

    useEffect(() => {
        const fetchVendores = async () => {
          await obtenerUsuarios(
            (response) => {
              setVendedores(response.data);
            },
            (error) => {
              console.error(error);
            }
          );
        };

        const fetchProductos = async () => {
            await obtenerProductos(
                (response) => {
                setProductos(response.data);
                },
                (error) => {
                console.error(error);
                }
            );
            };
        
            fetchVendores();
            fetchProductos();
        }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        const fd = new FormData(form.current);
        
        const formData = {};
        fd.forEach((value, key) => {
            formData[key] = value;
        });
        
        console.log('form data', formData);

        const listaProductos = Object.keys(formData)
        .map((k) => {
          if (k.includes('producto')) {
            return productosTabla.filter((p) => p._id === formData[k])[0];
          }
          return null;
        })
        .filter((p) => p);  

        const datosVenta = {
            vendedor: vendedores.filter((v) => v._id === formData.vendedor)[0],
            descripcion: listaProductos,
            cantidad: formData.valor,
            fecha: formData.fecha,
            cliente: formData.cliente,
            documento: formData.documento,
            tventa: formData.tventa,
            estado: formData.estado
        };
      
          await crearVenta(
            datosVenta,
            (response) => {
              console.log(response);
            },
            (error) => {
              console.error(error);
            }
          );
            setMostrarTabla(true);
            setVentas([...listaVentas, datosVenta]);
        };
        
        return (
            <div className='flex h-full w-full items-center justify-center'>
              <form ref={form} onSubmit={submitForm} className='flex flex-col h-full'>
                <h1 className='text-3xl font-extrabold text-gray-900 my-3'>Crear una nueva venta</h1>
                <label className='flex flex-col' htmlFor='vendedor'>
                  <span className='text-2xl font-gray-900'>Vendedor</span>
                  <select name='vendedor' className='p-2' defaultValue='' required>
                    <option disabled value=''>
                      Seleccione un Vendedor
                    </option>
                    {vendedores.map((el) => {
                      return <option key={nanoid()} value={el._id}>{`${el.name}`}</option>;
                    })}
                  </select>
                </label>
                    
                <TablaDatos/>
                <TablaProductos
         productos ={productos} 
         setProductos={setProductos}
         setProductosTabla= {setProductosTabla}/>
                

        {/* <label className='flex flex-col'>
          <span className='text-2xl font-gray-900'>Valor Total Venta</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            name='valor'
            required
          />
        </label> */}
        <button
          type='submit'
          className='col-span-2 bg-indigo-500 p-2 rounded-full shadow-md hover:bg-indigo-600 text-white'
        >
          Crear Venta
        </button>
      </form>
    </div>
  );
}

const TablaProductos = ({productos, setProductos, setProductosTabla}) => {
    
    const [productoAgregar, setProductoAgregar] = useState({})
    const [filasTabla, setFilasTabla] = useState([])
    // const [vSumTotal, setVSumTotal] = useState(0);

    // useEffect(() => {
    //     const handlesumar = () => {
    //       const sumar = filasTabla.map((e) => parseFloat(e.total))
    //         .reduce((previous, current) => {
    //           return previous + current;
    //         }, {filasTabla});
    //         setVSumTotal(sumar);
    //     };
    //     handlesumar();
    //   });
     
    useEffect(() => {
        setProductosTabla(filasTabla);
    }, {filasTabla, setProductosTabla})


    const agregarNuevoProducto = () =>{
        setFilasTabla([...filasTabla, productoAgregar])
        setProductos(productos.filter((p)=> p._id !== productoAgregar._id))
        setProductoAgregar({})
    }
    
    const eliminarFilaProducto = (productoAEliminar) => {
        setFilasTabla(filasTabla.filter((p) => p._id !== productoAEliminar._id))
        setProductos([...productos, productoAEliminar])
    }

    const modificarProducto = (producto, cantidad) => {
        setFilasTabla(
          filasTabla.map((ft) => {
            if (ft._id === productos.id) {
              ft.cantidad = cantidad;
              ft.total = productos.valor * cantidad;
            }
            return ft;
        })
      );
    };

    return (
        <div>   
        <div className = 'flex'>
            <label className = 'flex flex-col' htmlFor="producto">
                <select className = 'p-2' 
                        value={productoAgregar._id ?? ''}
                        onChange={(e) => setProductoAgregar(productos.filter((p) => p._id === e.target.value)[0])}>
                    <option disable value= ''>
                        Seleccione un Producto
                    </option>
                    {productos.map((el) => {
                        return (
                            <option key={nanoid()} 
                            value={el._id}>
                                {`${el.descripcion}`}
                            </option>
                        );
                    })}
         </select>
            </label>
            <button
            type='button'
            onClick = {() => agregarNuevoProducto()}
            className= ' col-span-2 bg-indigo-500 p-2 rounded-full text-white'>
                Agregar Producto
            </button>
        </div> 
        <table className = 'tabla'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Producto</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Eliminar</th>
                        <th className = 'hidden'>Input</th>
                    </tr>
                </thead>
                <tbody>
          {filasTabla.map((el, index) => {
            return (
              <FilaProducto
                key={el._id}
                pro={el}
                index={index}
                eliminarFilaProducto={eliminarFilaProducto}
                modificarProducto={modificarProducto}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const FilaProducto = ({ pro, index, eliminarFilaProducto, modificarProducto }) => {
    const [producto, setProducto] = useState(pro);
    
    useEffect(() => {
      console.log('pro', producto);
        }, [producto]);
    
        return (

        <tr>
            <td>{producto._id}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.estado}</td>
            <td>{producto.precio}</td>
            <td>
        <label htmlFor={`valor_${index}`}>
          <input
            type='number'
            name={`cantidad_${index}`}
            value={producto.cantidad}
            onChange={(e) => {
                modificarProducto(producto, e.target.value === '' ? '0' : e.target.value);
                setProducto({
                ...producto,
                cantidad: e.target.value === '' ? '0' : e.target.value,
                total:
                  parseFloat(producto.precio) *
                  parseFloat(e.target.value === '' ? '0' : e.target.value),
              });
            }}
          />
        </label>
        </td>
      {/* <td>{producto.valor}</td> */}
      <td>{parseFloat(producto.total ?? 0)}</td>
      <td>
        <i
          onClick={() => eliminarFilaProducto(producto)}
          className='fas fa-minus text-red-500 cursor-pointer'
        />
      </td>
      <td className='hidden'>
        <input hidden defaultValue={producto._id} name={`producto_${index}`} />
      </td>
    </tr>
);   
};

const TablaDatos = () => {

    return(
        <table className='tabla'>
            <thead>
                    <tr key={nanoid()}>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Documento</th>
                        <th>Total Venta</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="date" 
                    name='fecha'
                    />
                </td>
                <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="text" 
                    name='cliente'
                    />
                </td>
                <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="number" 
                    name='documento'
                    />
                </td>
                <td>
                    <input 
                    className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2'
                    type="number" 
                    name='tventa'
                    />
                </td>
                <td>
                    <select 
                        required
                        name='estado' 
                        className='bg-gray-100 border border-gray-600 p-2 rounded-lg m-2' 
                        defaultValue=''>
                            <option disabled value= ''>Selecciona</option>
                            <option>Entregada</option>
                            <option>En Proceso</option>
                            <option>Cancelada</option>
                    </select>
                </td>
                </tbody>
        </table>
    )
}

export default Ventas;
