import React, {FC, useEffect, useState} from 'react';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "../Transactions/style";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {
  StyledOverview,
  StyledTile, StyledTileContent,
  StyledTileHeader,
  StyledTileSelector, StyledTileSelectorsWrapper,
  StyledTileTitle,
  StyledTileValue
} from "./styled";
import {dataMainType} from "../Table/Table";
import {StyledSelector} from "../Statistics/styled";
import _ from "lodash";
import {setPeriod, setType, StatPeriod, StatType} from "../../redux/statSlice";
import moment from "moment/moment";
import TransactionTimeChart from "../Statistics/TransactionTimeChart/TransactionTimeChart";
import {fetchTransactionsAsync, fetchTransCatsAsync} from "../../redux/transactionSlice";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync, fetchItemsAsync} from "../../redux/basicInvestSlice";
import PieChartComponent from "../Statistics/PieChartComponent/PieChartComponent";
import {
  Area,
  AreaChart, Bar, BarChart,
  CartesianGrid, Legend,
  Line,
  LineChart, PolarGrid, PolarRadiusAxis, Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useTranslation} from "react-i18next";
import {IOtherInvestment} from "../Investments/Overview/InvestOverview";
import {fetchOtherInvestAsync} from "../../redux/otherInvestSlice";
import {StyledResponsiveContainer} from "../Statistics/TransactionTimeChart/style";
import {getAllData} from "../Statistics/Statistics";
import basicInvestments from "../Investments/BasicInvestments/BasicInvestments";
import {getCustomExchangeRate} from "../../redux/userSlice";

export const filterDataByPeriod = (actualPeriod: StatPeriod, data: any[]) => {
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

const Overview: FC<NavInterface> = ({
  visible,
  toggle,
                                    }) => {
  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const {t} = useTranslation();

  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const invests = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const otherInvests = useSelector((state: RootState) => state.otherInvestments.otherInvests);

  const actualPeriod = useSelector((state: RootState) => state.stats.period);
  const actualType = useSelector((state: RootState) => state.stats.type);

  const transLoadingStatus = useSelector((state: RootState) => state.transactions.transLoading);
  const basicLoadingStatus = useSelector((state: RootState) => state.basicInvestments.basicLoading);


  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPeriod(event.target.value));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setType(event.target.value));
  };


  const getTotal = (data: [any[], any[]]) => {

    const filteredByPeriod = filterDataByPeriod(actualPeriod, _.flattenDeep(data));

    return _.round(filteredByPeriod.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    }, 0), 2);
  }

  useEffect(() => {
    // if (transLoadingStatus !== 'succeeded') {
    //   dispatch(fetchTransactionsAsync()).then(() =>
    //     dispatch(fetchTransCatsAsync())
    //   );
    // }
    //
    // if (basicLoadingStatus !== 'succeeded') {
    //   dispatch(fetchOtherInvestAsync());
    //   dispatch(fetchItemsAsync()).then(() => {
    //     dispatch(fetchBasicInvestsAsync()).then(() => {
    //       dispatch(fetchInvestCatsAsync())
    //     })
    //   });
    // }

  }, [transactions, invests, otherInvests]);

  return (
    <Layout>
      <Header toggle={toggle} visible={visible}/>
      <Navigation toggle={toggle} visible={visible}/>
      <Content onClick={() => toggle(false)}>
        <StyledTitle>{t('overview')}{userInfo.username && ` | ${t('hello')}, ${userInfo.username}`}</StyledTitle>

        <StyledOverview>
          <StyledTile className={'tile_trans'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('totalTrans')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal([transactions, []])} {userInfo.currSlug}
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart data={filterDataByPeriod(actualPeriod, transactions)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_invest'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('totalInvest')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal([invests, otherInvests])} {userInfo.currSlug}
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart width={300} height={100} data={filterDataByPeriod(actualPeriod, [...invests, ...otherInvests])}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_stats'}>
            <StyledTileHeader className={'tile_stats-header'}>
              <StyledTileTitle>{t('statistics')}</StyledTileTitle>
              <StyledTileSelectorsWrapper>
                <StyledTileSelector onChange={handlePeriodChange}>
                  {
                    _.keys(StatPeriod).map((period, i) =>
                      (<option selected={actualPeriod === _.values(StatPeriod)[i]}
                               value={period}>{_.values(StatPeriod)[i]}</option>))
                  }
                </StyledTileSelector>
              </StyledTileSelectorsWrapper>
            </StyledTileHeader>
            {
              getAllData(actualPeriod, transactions, invests, otherInvests).length
                ? <StyledResponsiveContainer>
                  <BarChart
                    width={500}
                    height={300}
                    data={getAllData(actualPeriod, transactions, invests, otherInvests)}
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
                    <Bar dataKey="Transactions" stackId="a" fill="#25AB52" />
                    <Bar dataKey="Basic investments" stackId="a" fill="#27aeef" />
                    <Bar dataKey="Other investments" stackId="a" fill="#b33dc6" />
                  </BarChart>
                </StyledResponsiveContainer>
                : 'Sorry, but you don\'t have data for current period('
            }


            {/*<TransactionTimeChart transactions={filterDataByPeriod(actualType === StatType.investments ? invests : transactions)} period={actualPeriod} />*/}
          </StyledTile>

        </StyledOverview>
      </Content>
    </Layout>

  );
};

export default Overview;

