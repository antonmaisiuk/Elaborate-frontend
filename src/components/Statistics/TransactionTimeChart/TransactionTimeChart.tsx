import React from 'react';
import {
  XAxis,
  CartesianGrid,
  Tooltip,
  AreaChart, Area,
} from 'recharts';
import {dataMainType} from '../../Table/Table';
import {StatPeriod} from "../../../redux/statSlice";
import {StyledNoData} from "../styled";
import {StyledResponsiveContainer} from "./style"; // Assuming you have this exported from another file

interface ChartData {
  date: string;
  totalValue: number;
}

interface TransactionTimeChartProps {
  transactions: dataMainType[];
  period: StatPeriod;
}

const TransactionTimeChart: React.FC<TransactionTimeChartProps> = ({
                                                                     transactions,
                                                                   }) => {
  const summarizeTransactions = (
    transactions: dataMainType[]
  ): ChartData[] => {
    const summary = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (!transaction.date) return;

      const parts = transaction.date.split('.');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      const value = summary.get(formattedDate) || 0;
      summary.set(formattedDate, value + transaction.value);
    });

    const dataArray = Array.from(summary, ([date, totalValue]) => ({
      date,
      totalValue,
    })).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return dataArray;
  };

  const chartData = summarizeTransactions(transactions);

  return (
    chartData.length
      ?
      <StyledResponsiveContainer>

        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3'/>
          <XAxis dataKey='date'/>
          <Tooltip/>
          <Area
            type='monotone'
            dataKey='totalValue'
            stroke='#25AB52'
            fill="#25AB52"
            activeDot={{r: 8}}
          />
        </AreaChart>
      </StyledResponsiveContainer>

      :
      <StyledNoData>Sorry, but you don't have data for current period(</StyledNoData>
  );
};

export default TransactionTimeChart;
