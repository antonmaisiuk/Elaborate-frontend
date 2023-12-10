import React, {FC} from 'react';
import Layout from "../../Layout/Layout";
import Navigation, {NavInterface} from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "../../Transactions/style";

export enum BasicInvestmentType {
  stocks,
  crypto,
  metals
}

export interface IBasicInvestment {
  id: string,
  item: string,
  itemId: string,
  category: string,
  categoryId: string,
  comment: string,
  date: string,
  amount: number,
  value: number,
}

export interface IBasicInvestmentCat {
  id: string,
  name?: string,
  index?: string
}

export interface IItem {
  id:	string,
  name:	string,
  index:	string,
  categoryInvestmentId:	string
}

const InvestOverview: FC<NavInterface> = ({
  visible,
  toggle,
}) => {
  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content>
        <StyledTitle>Investments Overview</StyledTitle>

      </Content>
    </Layout>
  );
};

export default InvestOverview;
