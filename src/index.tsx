import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {store} from "./redux/store";
import {Provider} from "react-redux";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com">
    <React.StrictMode>
      {/*<Provider store={store}>*/}
      <App />
      {/*</Provider>*/}
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
