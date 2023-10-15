import { GoogleOAuthProvider } from '@react-oauth/google';
import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import Login from '../Login/Login';


const PrivateRoute = () => document.cookie.match('token') ? <Outlet/> : <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com"><Login/></GoogleOAuthProvider>

export default PrivateRoute;
