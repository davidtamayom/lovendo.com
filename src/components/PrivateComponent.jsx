import React from 'react';
import {useUser} from '../context/userContext.js'

const PrivateComponent = ({roleList, children}) =>{

        const {userData} = useUser();

    if(roleList.includes(userData.rol)){
        return children;
    } else {
        return <> </>;
    }
}

export default PrivateComponent;