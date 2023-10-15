import React, {useEffect, useState} from 'react';
// import styled from 'styled-components';
import Registration from './components/Auth/Registration/Registration';
import Login from './components/Auth/Login/Login';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {GoogleOAuthProvider} from "@react-oauth/google";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import Overview from "./components/Overview/Overview";
import EmailConfirm from "./components/Auth/EmailConfirm/EmailConfirm";
import Transactions from "./components/Transactions/Transactions";
import PrivateRoute from './components/Auth/PrivateRoute/PrivateRoute';



const AppContainer = styled.div`
  display: flex;
  justify-content: space-around;
  //padding: 20px;
`;

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com">
            <Login />
          </GoogleOAuthProvider>
          }/>
        <Route path="/register" element={
          <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com">
            <Registration/>
          </GoogleOAuthProvider>
          }/>
        <Route path="/forgot" element={<ForgotPassword />}/>
        {/*<PrivateRoute path="/transactions" element={<Transactions/>} exact/>*/}
        <Route element={<PrivateRoute/>}>
          <Route path="/overview" element={<Overview/>}/>
          <Route path="/transactions" element={<Transactions/>}/>
          <Route path="/confirm" element={<EmailConfirm/>}/>
        </Route>
        {/*<Route path="/home" element={<Home userName={name} setUserName={setName} />}/>*/}
        <Route path="/" element={
          <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com">
            <Login />
          </GoogleOAuthProvider>
        }/>
      </Routes>
    </Router>
    //   <React.StrictMode>
    //     {/*<Login />*/}
    //     {/*<Registration />*/}
    //     <EmailConfirm />
    //   </React.StrictMode>
    // <AppContainer>

    // </AppContainer>
  );
};

export default App;
