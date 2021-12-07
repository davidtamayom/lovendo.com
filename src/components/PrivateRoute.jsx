import React, {useEffect} from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import {obtenerDatosUsuario} from '../utils/api.js'
import {useUser} from '../context/userContext.js'

const PrivateRoute = ({children}) => {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const {setUserData} =useUser();


    useEffect(() => {
        const fetchAuth0Token = async () => {
            const accessToken = await getAccessTokenSilently({
                audience: 'api-autenticacion-lovendo',
        });
        localStorage.setItem('token', accessToken)
        await obtenerDatosUsuario(
            (response) => {
                console.log('Response', response)
                setUserData(response.data);
        },
        (error) => {
            console.log('Error', error)
        })
        };
        if(isAuthenticated){
        fetchAuth0Token();
        }
    }, [isAuthenticated, getAccessTokenSilently]);


    if (isLoading) return <div>Loading...</div>;

    return isAuthenticated ? (
        <>{children}</>
    ) : (
        <div className='text-9xl text-red-500'>Nos Estás Autorizado para ver este Sitio</div>
    );
};

export default PrivateRoute;
