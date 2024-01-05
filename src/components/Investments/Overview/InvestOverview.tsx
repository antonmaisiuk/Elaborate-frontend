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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
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
import {filterDataByPeriod} from "../../Overview/Overview";
import {StyledResponsiveContainer} from "../../Statistics/TransactionTimeChart/style";
import {getAllData} from "../../Statistics/Statistics";

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
  unit?: string;
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
  const stocks = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === process.env.REACT_APP_STOCKS_ID);
  const metals = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === process.env.REACT_APP_METALS_ID);
  const crypto = _.filter(invests, (invest: IBasicInvestment) => invest.categoryId === process.env.REACT_APP_CRYPTO_ID);

  const otherInvests = useSelector((state: RootState) => state.otherInvestments.otherInvests);

  const actualPeriod = useSelector((state: RootState) => state.stats.period);
  const actualType = useSelector((state: RootState) => state.stats.type);

  const basicLoadingStatus = useSelector((state: RootState) => state.basicInvestments.basicLoading);

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

    const filteredByPeriod = filterDataByPeriod(actualPeriod, data);

    return _.round(filteredByPeriod.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    }, 0), 2);
  }

  useEffect(() => {
    // if (basicLoadingStatus !== 'succeeded') {
    //   dispatch(fetchOtherInvestAsync());
    //   dispatch(fetchItemsAsync()).then(() => {
    //     dispatch(fetchBasicInvestsAsync()).then(() => {
    //       dispatch(fetchInvestCatsAsync())
    //     })
    //   });
    // }

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
              {getTotal(stocks)} $
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
              {getTotal(crypto)} $
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
              {getTotal(metals)} $
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
              {getTotal(otherInvests)} $
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
            <StyledResponsiveContainer>
              <BarChart
                width={500}
                height={300}
                data={getAllData(actualPeriod, [], invests, otherInvests)}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/*<Bar dataKey="Transactions" stackId="a" fill="#25AB52" />*/}
                <Bar dataKey="Basic investments" stackId="a" fill="#27aeef" />
                <Bar dataKey="Other investments" stackId="a" fill="#b33dc6" />
              </BarChart>
            </StyledResponsiveContainer>
          </StyledTile>

        </StyledInvestsOverview>
      </Content>
    </Layout>

  );
};

export default InvestOverview;
