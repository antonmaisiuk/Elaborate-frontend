import { GoogleOAuthProvider } from '@react-oauth/google';
import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import Login from '../Login/Login';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {getUserAsync, setRoute} from "../../../redux/userSlice";


const PrivateRoute = () => {

  const dispatch = useDispatch<AppDispatch>();
  dispatch(setRoute(window.location.href.split(/\d\//)[1]));
  const user = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    // if (!user){
      dispatch(getUserAsync())
    // }
  }, []);

  return document.cookie.match('token') ? <Outlet/> : <GoogleOAuthProvider
    clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com"><Login/></GoogleOAuthProvider>
}

export default PrivateRoute;
