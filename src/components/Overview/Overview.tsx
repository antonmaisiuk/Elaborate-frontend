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
import {Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useTranslation} from "react-i18next";
import {IOtherInvestment} from "../Investments/Overview/InvestOverview";
import {fetchOtherInvestAsync} from "../../redux/otherInvestSlice";

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

  const transLoadingStatus = useSelector((state: RootState) => state.transactions.loading);
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

  const getTotal = (data: [any[], any[]]) => {

    const filteredByPeriod = filterItems(_.flattenDeep(data));
    console.log('👉 filteredByPeriod: ', filteredByPeriod);

    return _.round(filteredByPeriod.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    }, 0), 2);
  }

  useEffect(() => {
    if (transLoadingStatus !== 'succeeded') {
      dispatch(fetchTransactionsAsync()).then(() =>
        dispatch(fetchTransCatsAsync())
      );
    }

    if (basicLoadingStatus !== 'succeeded') {
      dispatch(fetchOtherInvestAsync());
      dispatch(fetchItemsAsync()).then(() => {
        dispatch(fetchBasicInvestsAsync()).then(() => {
          dispatch(fetchInvestCatsAsync())
        })
      });
    }

  }, [transactions, invests, otherInvests]);


  // const [navVisible, toggleNavVisible] = useState(false);

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
              {getTotal([transactions, []])} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart data={filterItems(transactions)}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_invest'}>
            <StyledTileHeader>
              <StyledTileTitle>{t('totalInvest')}</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal([invests, otherInvests])} zł
            </StyledTileValue>
            <ResponsiveContainer className={'tile_chart'} width="100%" height="60%">
              <LineChart width={300} height={100} data={filterItems([...invests, ...otherInvests])}>
                <Line type="monotone" dataKey="value" stroke="#25AB52" dot={false} strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </StyledTile>

          <StyledTile className={'tile_stats'}>
            <StyledTileHeader className={'tile_stats-header'}>
              <StyledTileTitle>{t('statistics')}</StyledTileTitle>
              <StyledTileSelectorsWrapper>
                <StyledTileSelector onChange={handleTypeChange}>
                  {
                    _.keys(StatType).map((type, i) =>
                      (<option selected={actualType === _.values(StatType)[i]}
                               value={type}>{_.values(StatType)[i]}</option>))
                  }
                </StyledTileSelector>
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

        </StyledOverview>
      </Content>
    </Layout>

  );
};

export default Overview;

