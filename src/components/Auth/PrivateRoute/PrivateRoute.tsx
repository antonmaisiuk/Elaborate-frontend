import { GoogleOAuthProvider } from '@react-oauth/google';
import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import Login from '../Login/Login';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {getUserAsync, getUserHistoryAsync, setRoute} from "../../../redux/userSlice";
import {fetchOtherInvestAsync} from "../../../redux/otherInvestSlice";
import {
  fetchBasicInvestsAsync,
  fetchInvestCatsAsync,
  fetchItemsAsync, getPrice,
  setInvest
} from "../../../redux/basicInvestSlice";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../../redux/transactionSlice";
import _ from "lodash";
import {IItem} from "../../Investments/Overview/InvestOverview";


const PrivateRoute = () => {

  const dispatch = useDispatch<AppDispatch>();

  dispatch(setRoute(window.location.href.split(/\d\//)[1]));
  const userLoading = useSelector((state: RootState) => state.user.userLoading);
  const historyLoading = useSelector((state: RootState) => state.user.historyLoading);
  const otherLoading = useSelector((state: RootState) => state.otherInvestments.loading);
  const basicInvest = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const basicLoading = useSelector((state: RootState) => state.basicInvestments.basicLoading);
  const basicCatLoading = useSelector((state: RootState) => state.basicInvestments.basicCatLoading);
  const transLoading = useSelector((state: RootState) => state.transactions.transLoading);
  const transCatLoading = useSelector((state: RootState) => state.transactions.catsLoading);
  const items = useSelector((state: RootState) => state.basicInvestments.items);
  const itemsLoading = useSelector((state: RootState) => state.basicInvestments.itemsLoading);


  try {
    if (userLoading === 'idle') dispatch(getUserAsync())
    if (historyLoading === 'idle') dispatch(getUserHistoryAsync())
    if (otherLoading === 'idle') dispatch(fetchOtherInvestAsync());
    if (itemsLoading === 'idle') dispatch(fetchItemsAsync()).then(() => {
      if (basicLoading === 'idle') dispatch(fetchBasicInvestsAsync());
      if (basicCatLoading === 'idle') dispatch(fetchInvestCatsAsync());
    });
    if (transLoading === 'idle') dispatch(fetchTransactionsAsync()).then(() => {
      if (transCatLoading === 'idle') dispatch(fetchTransCatsAsync());
    });

    // _.forEach(basicInvest, async (invest) => {
    //   dispatch(setInvest({
    //     ...invest,
    //     value: invest.amount * await getPrice(state.basicInvestments.items.filter((item: IItem) => item.id === invest.itemId)[0].index, invest.categoryId),
    //
    //   }))
    // })

  } catch (e){
    console.log('👉 Error: ', e);
  }

  // dispatch(getUserAsync()).then(() => {
  //   dispatch(fetchOtherInvestAsync()).then(() => {
  //     dispatch(fetchItemsAsync()).then(() => {
  //       dispatch(fetchBasicInvestsAsync()).then(() => {
  //         dispatch(fetchInvestCatsAsync()).then(() => {
  //           dispatch(fetchTransactionsAsync()).then(() => dispatch(fetchTransCatsAsync()));
  //         })
  //       })
  //     });
  //   });
  //   })

  // useEffect(() => {
    // if (!user){
    // }
  // }, []);

  return document.cookie.match('token') ? <Outlet/> : <GoogleOAuthProvider
    clientId="106155053534-6d2124m98sto75hhemhjo2fa0339l08n.apps.googleusercontent.com"><Login/></GoogleOAuthProvider>
}

export default PrivateRoute;
