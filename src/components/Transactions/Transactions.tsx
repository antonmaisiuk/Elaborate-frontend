import React, {useEffect, useState} from 'react';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "./style";
import Table, { TransactionInter, TransCategoryInter } from "../Table/Table";
import moment from 'moment';
import { orderBy } from 'lodash';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../redux/transactionSlice";


export const getActualToken = () => {
  const token = document.cookie.match('token');

  if (token && token.input) return token.input.split('=')[1];

  return '';
}

const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const transCategories = useSelector((state: RootState) => state.transactions.transCategories);
  // console.log('👉 transactions: ', transactions);
  // console.log('👉 transCategories: ', transCategories);
  const [categories, setCategories] = useState<TransCategoryInter[]>([]);
  // @ts-ignore
  const [token, setToken] = useState(getActualToken());


  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  })

  const loadTransactionsData = async () => {
    await dispatch(fetchTransactionsAsync());
    await dispatch(fetchTransCatsAsync());
  }

  useEffect(() => {
  if (token) {
    dispatch(fetchTransactionsAsync()).then(() => dispatch(fetchTransCatsAsync()));
    // dispatch(fetchTransCatsAsync());
  } else navigate('/login');
  }, []);
  // await loadTransactionsData()

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent Transaction</StyledTitle>
        {<Table trans={transactions} tableData={transactions} transCatData={transCategories}/>}
      </Content>
    </Layout>
  );
};

export default Transactions;
