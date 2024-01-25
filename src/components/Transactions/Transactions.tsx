import React, {FC, useEffect, useState} from 'react';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "./style";
import Table, {TableType} from "../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {useTranslation} from "react-i18next";
import {StyledTileHeader} from "../Overview/styled";
import FilterHeader from "../FilterHeader/FilterHeader";
import _ from "lodash";
const Transactions: FC<NavInterface> = ({
                                          visible,
                                          toggle,
                                        }) => {
  const loadingStatus = useSelector((state: RootState) => state.transactions.transLoading);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const transCategories = useSelector((state: RootState) => state.transactions.transCategories);

  const [data, setData] = useState(transactions);

  const { t } = useTranslation();

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value){
      const searchResult = data.filter((item) => {
        const {id, categoryId, ...obj } = item;

        return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)))
      });
      setData(searchResult)
    } else {
      setData(transactions);
    }
  }

  useEffect(() => {
    if (loadingStatus === 'succeeded') {
      setData(transactions)
    } else {

    }
  }, [transactions]);

  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTileHeader>
          <StyledTitle>{t('recentTrans')}</StyledTitle>
          <FilterHeader tableCategories={transCategories} searchFunc={search} tableType={TableType.transactions}/>

        </StyledTileHeader>
        <Table tableType={TableType.transactions} tableData={data} tableCategories={transCategories}/>
      </Content>
    </Layout>
  );
};

export default Transactions;
