import React, {FC, useEffect} from 'react';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "./style";
import Table, {TableType} from "../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../redux/transactionSlice";
import {useTranslation} from "react-i18next";
import {StyledTileHeader} from "../Overview/styled";
import FilterHeader from "../FilterHeader/FilterHeader";


const Transactions: FC<NavInterface> = ({
                                          visible,
                                          toggle,
                                        }) => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const transCategories = useSelector((state: RootState) => state.transactions.transCategories);
  const loadingStatus = useSelector((state: RootState) => state.transactions.loading);

  const { t } = useTranslation();

  useEffect(() => {
    if (loadingStatus !== 'succeeded'){
      dispatch(fetchTransactionsAsync()).then(() => dispatch(fetchTransCatsAsync()));
    }
  }, []);

  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTileHeader>
          <StyledTitle>{t('recentTrans')}</StyledTitle>
          {/*<FilterHeader tableCategories={transCategories} searchFunc={() => {}} tableType={TableType.transactions}/>*/}

        </StyledTileHeader>
        <Table tableType={TableType.transactions} tableData={transactions} tableCategories={transCategories}/>
      </Content>
    </Layout>
  );
};

export default Transactions;
