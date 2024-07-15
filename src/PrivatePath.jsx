import React from 'react'
import {useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';
import {REACT_APP_ADMIN} from './config';
const PrivatePath = ({children}) => {
    const user=useSelector((state)=>state.user);
    if(user&&user.email===REACT_APP_ADMIN) return children;
    return <Navigate to="/"/>
}

export default PrivatePath