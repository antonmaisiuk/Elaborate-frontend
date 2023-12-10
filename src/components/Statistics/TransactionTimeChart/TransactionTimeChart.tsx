// TransactionTimeChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import {dataMainType, ITransaction} from '../../Table/Table';
import {StatPeriod} from "../../../redux/statSlice";
import {StyledNoData} from "../styled"; // Assuming you have this exported from another file

interface ChartData {
  date: string;
  totalValue: number;
}

interface TransactionTimeChartProps {
  transactions: dataMainType[];
  period: StatPeriod;
}

// Inside the TransactionTimeChart component
const TransactionTimeChart: React.FC<TransactionTimeChartProps> = ({
                                                                     transactions,
                                                                   }) => {
  const summarizeTransactions = (
    transactions: dataMainType[]
  ): ChartData[] => {
    // Aggregate transactions by date
    const summary = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (!transaction.date) return; // Skip if date is undefined or null

      // Convert "DD.MM.YYYY" to "YYYY-MM-DD" for proper date parsing
      const parts = transaction.date.split('.');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      const value = summary.get(formattedDate) || 0;
      summary.set(formattedDate, value + transaction.value);
    });

    // Convert the map to an array and sort by the converted date
    const dataArray = Array.from(summary, ([date, totalValue]) => ({
      date,
      totalValue,
    })).sort((a, b) => {
      // Convert to Date object and get time in milliseconds for comparison
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return dataArray;
  };

  // Assuming the parent component provides filtered data based on the period
  const chartData = summarizeTransactions(transactions);

  return (
    chartData.length
      ?
      <ResponsiveContainer width='99%' height='80%' style={{display: "flex", alignItems: "center"}} aspect={3}>

        <AreaChart
          // height={'80%'}
          data={chartData}
          // margin={{
          //   top: 5,
          //   right: 30,
          //   left: 0,
          //   bottom: 5,
          // }}
        >
          <CartesianGrid strokeDasharray='3 3'/>
          <XAxis dataKey='date'/>
          {/*<YAxis/>*/}
          <Tooltip/>
          {/*<Legend/>*/}
          <Area
            type='monotone'
            dataKey='totalValue'
            stroke='#25AB52'
            fill="#25AB52"
            activeDot={{r: 8}}
          />
        </AreaChart>
      </ResponsiveContainer>

      :
      <StyledNoData>Sorry, but you don't have data for current period(</StyledNoData>
  );
};

export default TransactionTimeChart;
