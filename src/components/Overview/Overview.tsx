import React from 'react';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "../Transactions/style";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {
  StyledOverview,
  StyledTile,
  StyledTileHeader,
  StyledTileSelector,
  StyledTileTitle,
  StyledTileValue
} from "./styled";
import {dataMainType} from "../Table/Table";
import {StyledSelector} from "../Statistics/styled";
import _ from "lodash";
import {setPeriod, StatPeriod} from "../../redux/statSlice";
import moment from "moment/moment";
import TransactionTimeChart from "../Statistics/TransactionTimeChart/TransactionTimeChart";

const Overview = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const invests = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const actualPeriod = useSelector((state: RootState) => state.stats.period);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPeriod(event.target.value));
  };

  const filterItems = (data: dataMainType[]) => {
    const now = moment();

    return data.filter((item: dataMainType) => {
      const [day, month, year] = item.date.split('.')
      const itemDate = moment(`${year}-${month}-${day}`);

      switch (actualPeriod) {
        case StatPeriod.today:
          return now.format('DD.MM.YYYY') === itemDate.format('DD.MM.YYYY');
        case StatPeriod.week:
          return (
            now.diff(itemDate,'weeks') === 0
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
  const getTotal = (data: dataMainType[]) => {

    const filteredByPeriod = filterItems(data)

    return filteredByPeriod.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    },0)
  }

  return (
    <Layout>
      <Navigation/>
      <Content>
        <Header/>
        <StyledTitle>Overview{userInfo.username && ` | Hello, ${userInfo.username}`}</StyledTitle>

        <StyledOverview>
          <StyledTile className={'tile_trans'}>
            <StyledTileHeader>
              <StyledTileTitle>Total transactions</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(transactions)} $
            </StyledTileValue>

          </StyledTile>
          <StyledTile className={'tile_invest'}>
            <StyledTileHeader>
              <StyledTileTitle>Total investments</StyledTileTitle>
            </StyledTileHeader>
            <StyledTileValue>
              {getTotal(invests)} $
            </StyledTileValue>
          </StyledTile>
          <StyledTile className={'tile_stats'}>
            <StyledTileHeader>
              <StyledTileTitle>Statistics</StyledTileTitle>
              <StyledTileSelector onChange={handlePeriodChange}>
                {
                  _.keys(StatPeriod).map((period, i) =>
                    (<option selected={actualPeriod === _.values(StatPeriod)[i]} value={period}>{_.values(StatPeriod)[i]}</option>))
                }
              </StyledTileSelector>
            </StyledTileHeader>
            <TransactionTimeChart transactions={filterItems(transactions)} period={actualPeriod} />
          </StyledTile>
          {/*<StyledTile className={'tile_basic'}>*/}
          {/*  <StyledTileHeader>Basic investments</StyledTileHeader>*/}

          {/*</StyledTile>*/}
          {/*<StyledTile className={'tile_other'}>*/}
          {/*  <StyledTileHeader>Other investments</StyledTileHeader>*/}

          {/*</StyledTile>*/}

        </StyledOverview>
      </Content>
    </Layout>
  );
};

export default Overview;

