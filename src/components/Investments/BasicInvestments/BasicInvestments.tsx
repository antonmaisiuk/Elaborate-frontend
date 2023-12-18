import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import Layout from "../../Layout/Layout";
import Navigation, {NavInterface} from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "./style";
import Table, {TableType} from "../../Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync, fetchItemsAsync} from "../../../redux/basicInvestSlice";
import {BasicInvestmentType, IBasicInvestment, IOtherInvestment} from "../Overview/InvestOverview";
import {useTranslation} from "react-i18next";
import {StyledTileHeader} from "../../Overview/styled";
import FilterHeader from "../../FilterHeader/FilterHeader";
import _ from "lodash";
import {fetchOtherInvestAsync} from "../../../redux/otherInvestSlice";

export interface BasicInvestmentsInterface {
  basicInvestType: BasicInvestmentType,
}

const BasicInvestments: FC<BasicInvestmentsInterface & HTMLAttributes<HTMLDivElement> & NavInterface> = ({
  visible,
  toggle,
  basicInvestType
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const basicInvestments = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const otherInvestments = useSelector((state: RootState) => state.otherInvestments.otherInvests);
  const investCategories = useSelector((state: RootState) => state.basicInvestments.basicInvestsCategories);
  const loadingStatus = useSelector((state: RootState) => state.basicInvestments.loading);

  const [title, setTitle] = useState('');
  const [data, setData] = useState(basicInvestType === BasicInvestmentType.other ? otherInvestments : basicInvestments);

  const { t } = useTranslation();

  const filterByType = () => {
    switch (basicInvestType) {
      case BasicInvestmentType.crypto:
        setTitle(t('recentCrypto'));
        setData(basicInvestments.filter((invest) => invest.categoryId === process.env.REACT_APP_CRYPTO_ID));
        break;
      case BasicInvestmentType.metals:
        setTitle(t('recentMetals'));
        setData(basicInvestments.filter((invest) => invest.categoryId === process.env.REACT_APP_METALS_ID));
        break;
      case BasicInvestmentType.stocks:
        setTitle(t('recentStocks'));
        setData(basicInvestments.filter((invest) => invest.categoryId === process.env.REACT_APP_STOCKS_ID));
        break;
      case BasicInvestmentType.other:
        setTitle(t('recentOther'));
        setData(otherInvestments);
        break;
      default:
    }
  }

  useEffect(() => {
    if (loadingStatus !== 'succeeded'){
      dispatch(fetchOtherInvestAsync());
      dispatch(fetchItemsAsync()).then(() => {
        dispatch(fetchBasicInvestsAsync()).then(() => {
          dispatch(fetchInvestCatsAsync())
        })
      });
    }

    if (loadingStatus === 'succeeded') {
      filterByType();
    }
  }, [basicInvestType, basicInvestments, otherInvestments]);

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value){
      // @ts-ignore
      const searchResult = data.filter((item: (IBasicInvestment | IOtherInvestment)) => {
        if (_.has(item, 'categoryId')){
          const {id, categoryId, ...obj } = item as IBasicInvestment;

          return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)));
        } else {
          const {id, ...obj } = item as IOtherInvestment;

          return _.values(obj).some((val) => new RegExp(value, 'i').test(String(val)));
        }
      });
      setData(searchResult)
    } else {
      filterByType();
    }
  }



  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTileHeader>
          <StyledTitle>{title}</StyledTitle>
          <FilterHeader
            tableCategories={investCategories}
            searchFunc={search}
            tableType={basicInvestType === BasicInvestmentType.other
            ? TableType.other
            : TableType.investments}
          />

        </StyledTileHeader>
        <Table
          tableType={basicInvestType === BasicInvestmentType.other
            ? TableType.other
            : TableType.investments}
          tableData={data}
          tableCategories={investCategories}/>
      </Content>
    </Layout>
  );
};

export default BasicInvestments;
