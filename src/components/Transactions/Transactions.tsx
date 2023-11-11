import React, {useEffect} from 'react';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "./style";
import Table, {TableType} from "../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../redux/transactionSlice";


const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const transCategories = useSelector((state: RootState) => state.transactions.transCategories);
  const loadingStatus = useSelector((state: RootState) => state.transactions.loading);

  useEffect(() => {
    if (loadingStatus !== 'succeeded'){
      dispatch(fetchTransactionsAsync()).then(() => dispatch(fetchTransCatsAsync()));
    }
  }, []);

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent Transaction</StyledTitle>
        <Table tableType={TableType.transactions} tableData={transactions} tableCategories={transCategories}/>
      </Content>
    </Layout>
  );
};

export default Transactions;
