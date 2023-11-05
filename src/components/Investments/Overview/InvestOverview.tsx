import React from 'react';


export interface IBasicInvestment {
  id: string,
  itemId: string,
  category: string,
  categoryId: string,
  comment: string,
  date: string,
  value: number,
}

export interface IBasicInvestmentCat {
  id: string,
  name?: string,
  index?: string
}


const InvestOverview = () => {
  return (
    <div>

    </div>
  );
};

export default InvestOverview;
