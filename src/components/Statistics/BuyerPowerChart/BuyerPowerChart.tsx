// BuyerPowerChart.tsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis, Bar, Line
} from 'recharts';
import {dataMainType, ITransaction} from '../../Table/Table';
import {StyledNoData} from "../styled";
import _ from "lodash";
import {IBasicInvestment, IOtherInvestment} from "../../Investments/Overview/InvestOverview";
import {StyledPieResponsiveContainer, StyledResponsiveContainer} from "../TransactionTimeChart/style";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import moment from "moment"; // Assuming you have this exported from another file

interface BuyerPowerChart {
  items: dataMainType[];
}

const getTotalInvestValue = (invests: (IBasicInvestment | IOtherInvestment)[]) => _.round(invests.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.value
}, 0), 2);

const getBuyingPowerData = (invest: (IBasicInvestment | IOtherInvestment)[], actualBuyerPeriod: string, inflation: { value: any, date: string}[]) => {
  const totalInvestValue = getTotalInvestValue(invest)
  const now = moment().startOf('M').subtract(1, 'M');
  let start = moment(actualBuyerPeriod);
  console.log('👉 totalInvestValue: ', totalInvestValue);
  console.log('👉 now: ', now.format('YYYY-MM'));

  const data = [];
  console.log('👉 current before: ', start.format('YYYY-MM'));
  let x0 = totalInvestValue;
  while (!start.isSame(now)) {
    console.log('---------\n');
    const currentInfl = _.head(_.filter(inflation, ({ date }) =>  date === moment(start).format('DD.MM.YYYY')));
    console.log('👉 currentInfl: ', currentInfl);
    if (!currentInfl) {
      start = moment(start).add(1, 'M');
    } else {
      const { value, date} = currentInfl;

      const power = _.round((x0 * ((100 - value) / 100)) + x0, 2);
      console.log('👉 power: ', power);
      data.push({ value: power, date });

      x0 = power;
      start = moment(start).add(1, 'M');
      console.log('---------\n');
    }
  }


  return data;
}

const BuyerPowerChart: React.FC = () => {
  const actualBuyerPeriod = useSelector((state: RootState) => state.stats.buyerPeriod);
  const inflation = useSelector((state: RootState) => state.user.inflation);
  const invests = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const otherInvests = useSelector((state: RootState) => state.otherInvestments.otherInvests);
  const data: string | any[] | undefined = [{}, {}];


  return (
    data.length ?
      <StyledPieResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={getBuyingPowerData([...invests, ...otherInvests], actualBuyerPeriod, inflation)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 5000', 'dataMax + 5000']} />
          <Tooltip />
          <Legend />
          <Line dataKey="value" />
          <Bar dataKey="value" fill="rgb(39, 178, 86)" />
        </BarChart>
      </StyledPieResponsiveContainer>
      :
      <StyledNoData>Sorry, but you don't have data for current period(</StyledNoData>
  );
};

export default BuyerPowerChart;
