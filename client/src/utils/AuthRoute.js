import React, {useContext} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

import {AuthContext} from '../context/auth';

// Reroute user to home page if trying to access login or register page
function AuthRoute() {
    const {user} = useContext(AuthContext);

    return (
        user ? <Navigate to="/" /> : <Outlet/>
    )
}

export default AuthRoute;