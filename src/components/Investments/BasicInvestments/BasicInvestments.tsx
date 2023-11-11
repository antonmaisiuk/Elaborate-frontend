import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import Layout from "../../Layout/Layout";
import Navigation from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "./style";
import Table, {TableType} from "../../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {
  fetchBasicInvestsAsync,
  fetchInvestCatsAsync,
  fetchItemsAsync
} from "../../../redux/basicInvestSlice";
import {BasicInvestmentType} from "../Overview/InvestOverview";

export interface BasicInvestmentsInterface {
  basicInvestType: BasicInvestmentType,
}

const BasicInvestments: FC<BasicInvestmentsInterface & HTMLAttributes<HTMLDivElement>> = ({
  basicInvestType
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const basicInvestments = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const investCategories = useSelector((state: RootState) => state.basicInvestments.basicInvestsCategories);
  const loadingStatus = useSelector((state: RootState) => state.basicInvestments.loading);

  const [title, setTitle] = useState('');
  const [data, setData] = useState(basicInvestments);

  useEffect(() => {
    if (loadingStatus !== 'succeeded'){
      dispatch(fetchItemsAsync()).then(() => {
        dispatch(fetchBasicInvestsAsync()).then(() => {
          dispatch(fetchInvestCatsAsync())
        })
      });
    }

    if (loadingStatus === 'succeeded') {
      switch (basicInvestType) {
        case BasicInvestmentType.crypto:
          setTitle('Cryptocurrencies');
          setData(basicInvestments.filter((invest) => invest.categoryId === '029e8ff3-8aca-4b2e-a938-7a1e97fb9c8d'));
          break;
        case BasicInvestmentType.metals:
          setTitle('Precious metals');
          setData(basicInvestments.filter((invest) => invest.categoryId === '2530f9f3-5dc5-4d7c-9233-3df8705bd4e2'));
          break;
        case BasicInvestmentType.stocks:
          setTitle('Stocks');
          setData(basicInvestments.filter((invest) => invest.categoryId === '59631964-1cf5-41b3-9e33-303d39033590'));
          break;
        default:
      }
    }
  }, [basicInvestType, basicInvestments]);




  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Recent {title}</StyledTitle>
        <Table tableType={TableType.investments} tableData={data} tableCategories={investCategories}/>
      </Content>
    </Layout>
  );
};

export default BasicInvestments;
