import React from 'react';

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

const InvestOverview = () => {
  return (
    <div>

    </div>
  );
};

export default InvestOverview;
