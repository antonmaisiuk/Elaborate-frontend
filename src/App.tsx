import React, {useEffect, useState} from 'react';
import Registration from './components/Auth/Registration/Registration';
import Login from './components/Auth/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, redirect, Route, Routes, useLocation} from 'react-router-dom';
import {GoogleOAuthProvider} from "@react-oauth/google";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import Overview from "./components/Overview/Overview";
import EmailConfirm from "./components/Auth/EmailConfirm/EmailConfirm";
import Transactions from "./components/Transactions/Transactions";
import PrivateRoute from './components/Auth/PrivateRoute/PrivateRoute';
import BasicInvestments from "./components/Investments/BasicInvestments/BasicInvestments";
import {Provider, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, store} from './redux/store';
import Statistics from './components/Statistics/Statistics'
import InvestOverview, {BasicInvestmentType} from "./components/Investments/Overview/InvestOverview";
import SetNewPassword from "./components/Auth/SetNewPassword/SetNewPassword";
import Settings from "./components/Settings/Settings";
import {getUserAsync, setRoute} from "./redux/userSlice";
import './i18n';
import _ from "lodash";

export const getActualToken = () => {
  let token = null;
  document.cookie.split(';').forEach((cookie) => {
    const [name,value] = cookie.split('=');
    if (name.trim() === 'token') token = value;
  })

  if (token) return token;

  redirect("/login");
  // window.location.reload();
}

const App = () => {

  const [navVisible, toggleNavVisible] = useState<boolean>(false);


  return (
      <Provider store={store}>
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
            <Route path="/api/Authentication/reset-password" element={<SetNewPassword />}/>
            <Route element={<PrivateRoute/>}>
              <Route path="/overview" element={<Overview visible={navVisible} toggle={toggleNavVisible}/>}/>
              <Route path="/transactions" element={<Transactions  visible={navVisible} toggle={toggleNavVisible}/>}/>
              <Route path="/invest" element={<InvestOverview visible={navVisible} toggle={toggleNavVisible}/>}/>
              <Route path="/invest/stocks" element={<BasicInvestments visible={navVisible} toggle={toggleNavVisible} basicInvestType={BasicInvestmentType.stocks}/>}/>
              <Route path="/invest/metals" element={<BasicInvestments visible={navVisible} toggle={toggleNavVisible} basicInvestType={BasicInvestmentType.metals}/>}/>
              <Route path="/invest/crypto" element={<BasicInvestments visible={navVisible} toggle={toggleNavVisible} basicInvestType={BasicInvestmentType.crypto}/>}/>
              <Route path="/invest/other" element={<BasicInvestments visible={navVisible} toggle={toggleNavVisible} basicInvestType={BasicInvestmentType.crypto}/>}/>
              <Route path="/confirm" element={<EmailConfirm/>}/>
              <Route path="/stats" element={<Statistics visible={navVisible} toggle={toggleNavVisible}/>}/>
              <Route path="/settings" element={<Settings visible={navVisible} toggle={toggleNavVisible}/>}/>
            </Route>
            <Route path="/" element={
              <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com">
                <Login />
              </GoogleOAuthProvider>
            }/>
          </Routes>
        </Router>

      </Provider>
  );
};

export default App;
