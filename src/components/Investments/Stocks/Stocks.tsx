import React, {useEffect} from 'react';
import Layout from "../../Layout/Layout";
import Navigation from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "./style";
import Table from "../../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync} from "../../../redux/basicInvestSlice";
import {fetchItemsAsync} from "../../../redux/itemSlice";


const Stocks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const items = useSelector((state: RootState) => state.item.items);
  const investCategories = useSelector((state: RootState) => state.basicInvestments.basicInvestsCategories);

  useEffect(() => {
    dispatch(fetchInvestCatsAsync()).then(() => dispatch(fetchBasicInvestsAsync()));
    dispatch(fetchItemsAsync());
  }, []);

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent Stocks</StyledTitle>
        <Table tableData={stocks} tableCategories={investCategories}/>
      </Content>
    </Layout>
  );
};

export default Stocks;
