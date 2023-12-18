import React, {FC, useEffect} from 'react';
import Layout from "../../Layout/Layout";
import Navigation, {NavInterface} from "../../Navigation/Navigation";
import Content from "../../Content/Content";
import Header from "../../Header/Header";
import {StyledTitle} from "../../Transactions/style";
import {
  StyledOverview,
  StyledTile,
  StyledTileHeader, StyledTileSelector,
  StyledTileSelectorsWrapper,
  StyledTileTitle,
  StyledTileValue
} from "../../Overview/styled";
import {Line, LineChart, ResponsiveContainer} from "recharts";
import _ from "lodash";
import {setPeriod, setType, StatPeriod, StatType} from "../../../redux/statSlice";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {dataMainType} from "../../Table/Table";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../../redux/transactionSlice";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync, fetchItemsAsync} from "../../../redux/basicInvestSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../redux/store";
import {fetchOtherInvestAsync} from "../../../redux/otherInvestSlice";
import {StyledInvestsOverview} from "./styled";

export enum BasicInvestmentType {
  stocks,
  crypto,
  metals,
  other,
}
export interface IBasicInvestment{
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

export interface IOtherInvestment{
  id: string,
  title: string,
  comment: string,
  date: string,
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
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const invests = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const stocks = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === '59631964-1cf5-41b3-9e33-303d39033590');
  const metals = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === '2530f9f3-5dc5-4d7c-9233-3df8705bd4e2');
  const crypto = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === '029e8ff3-8aca-4b2e-a938-7a1e97fb9c8d');

  const otherInvests = useSelector((state: RootState) => state.otherInvestments.otherInvests);

  const actualPeriod = useSelector((state: RootState) => state.stats.period);
  const actualType = useSelector((state: RootState) => state.stats.type);

  const basicLoadingStatus = useSelector((state: RootState) => state.basicInvestments.loading);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPeriod(event.target.value));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setType(event.target.value));
  };

  const filterItems = (data: any[]) => {
    const now = moment();

    return data.filter((item: dataMainType) => {
      const [day, month, year] = item.date.split('.')
      const itemDate = moment(`${year}-${month}-${day}`);

      switch (actualPeriod) {
        case StatPeriod.today:
          return now.format('DD.MM.YYYY') === itemDate.format('DD.MM.YYYY');
        case StatPeriod.week:
          return (
            now.diff(itemDate, 'weeks') === 0
          );
        case StatPeriod.month:
          return (
            itemDate.year() === now.year() &&
            itemDate.month() === now.month()
          );
        case StatPeriod.year:
          return itemDate.year() === now.year();
        case StatPeriod.all:
        default:
          return true;
      }
    });
  }

  const getTotal = (data: any[]) => {

    const filteredByPeriod = filterItems(data);
    console.log('👉 filteredByPeriod: ', filteredByPeriod);

    return _.round(filteredByPeriod.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    }, 0), 2);
  }

  useEffect(() => {
    if (basicLoadingStatus !== 'succeeded') {
      dispatch(fetchOtherInvestAsync());
      dispatch(fetchItemsAsync()).then(() => {
        dispatch(fetchBasicInvestsAsync()).then(() => {
          dispatch(fetchInvestCatsAsync())
        })
      });
    }

  }, [invests, otherInvests]);

  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTitle>{t('investOverview')}</StyledTitle>

        <StyledInvestsOverview>
          <StyledTile className={'tile_stocks'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('invests.totalStocks')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(stocks)} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart data={filterItems(stocks)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_crypto'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('invests.totalCrypto')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(crypto)} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart data={filterItems(crypto)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_metals'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('invests.totalMetals')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(metals)} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart width={300} height={100} data={filterItems(metals)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_other'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('invests.totalOther')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(otherInvests)} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart width={300} height={100} data={filterItems(otherInvests)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_stats'}>
            <StyledTileHeader className={'tile_stats-header'}>
              <StyledTileTitle>{t('statistics')}</StyledTileTitle>
              <StyledTileSelectorsWrapper>
                {/*<StyledTileSelector onChange={handleTypeChange}>*/}
                {/*  {*/}
                {/*    _.keys(StatType).map((type, i) =>*/}
                {/*      (<option selected={actualType === _.values(StatType)[i]}*/}
                {/*               value={type}>{_.values(StatType)[i]}</option>))*/}
                {/*  }*/}
                {/*</StyledTileSelector>*/}
                <StyledTileSelector onChange={handlePeriodChange}>
                  {
                    _.keys(StatPeriod).map((period, i) =>
                      (<option selected={actualPeriod === _.values(StatPeriod)[i]}
                               value={period}>{_.values(StatPeriod)[i]}</option>))
                  }
                </StyledTileSelector>
              </StyledTileSelectorsWrapper>
            </StyledTileHeader>
            {/*<TransactionTimeChart transactions={filterItems(actualType === StatType.investments ? invests : transactions)} period={actualPeriod} />*/}
          </StyledTile>

        </StyledInvestsOverview>
      </Content>
    </Layout>

  );
};

export default InvestOverview;
