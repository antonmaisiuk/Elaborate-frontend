import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import {Outlet} from "react-router-dom";
import Login from '../Login/Login';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {getExchangeRateAsync, getUserAsync, getUserHistoryAsync, setRoute} from "../../../redux/userSlice";
import {fetchOtherInvestAsync} from "../../../redux/otherInvestSlice";
import {
  fetchBasicInvestsAsync,
  fetchInvestCatsAsync,
  fetchItemsAsync
} from "../../../redux/basicInvestSlice";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../../redux/transactionSlice";
import _ from "lodash";

const PrivateRoute = () => {

  const dispatch = useDispatch<AppDispatch>();

  dispatch(setRoute(window.location.href.split(/\d\//)[1]));
  const userLoading = useSelector((state: RootState) => state.user.userLoading);
  const historyLoading = useSelector((state: RootState) => state.user.historyLoading);
  const exchangeLoading = useSelector((state: RootState) => state.user.exchangeLoading);
  const otherLoading = useSelector((state: RootState) => state.otherInvestments.loading);
  const basicLoading = useSelector((state: RootState) => state.basicInvestments.basicLoading);
  const basicCatLoading = useSelector((state: RootState) => state.basicInvestments.basicCatLoading);
  const transLoading = useSelector((state: RootState) => state.transactions.transLoading);
  const transCatLoading = useSelector((state: RootState) => state.transactions.catsLoading);
  const itemsLoading = useSelector((state: RootState) => state.basicInvestments.itemsLoading);

  const user = useSelector((state: RootState) => state.user);
  const currencies = useSelector((state: RootState) => state.user.currencies);

  try {
    if (userLoading === 'idle') dispatch(getUserAsync())
    if (historyLoading === 'idle') dispatch(getUserHistoryAsync())

    const currencySlug = _.filter(currencies, (curr) => user.userInfo.currency === curr.id)[0].index;
    if (exchangeLoading === 'idle') dispatch(getExchangeRateAsync(currencySlug))

    if (otherLoading === 'idle') dispatch(fetchOtherInvestAsync());
    if (itemsLoading === 'idle') dispatch(fetchItemsAsync()).then(() => {
      if (basicLoading === 'idle') dispatch(fetchBasicInvestsAsync());
      if (basicCatLoading === 'idle') dispatch(fetchInvestCatsAsync());
    });
    if (transLoading === 'idle') dispatch(fetchTransactionsAsync()).then(() => {
      if (transCatLoading === 'idle') dispatch(fetchTransCatsAsync());
    });

  } catch (e){
  }

  return document.cookie.match('token') ? <Outlet/> : <GoogleOAuthProvider
    clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com"><Login/></GoogleOAuthProvider>
}

export default PrivateRoute;
