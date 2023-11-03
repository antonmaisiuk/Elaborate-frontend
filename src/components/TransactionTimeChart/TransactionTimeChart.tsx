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
	ResponsiveContainer,
} from 'recharts';
import { TransactionInter } from '../Table/Table'; // Assuming you have this exported from another file

interface ChartData {
	date: string;
	totalValue: number;
}

interface TransactionTimeChartProps {
	transactions: TransactionInter[];
	period: 'month' | 'year' | 'all';
}

// Inside the TransactionTimeChart component
const TransactionTimeChart: React.FC<TransactionTimeChartProps> = ({
    transactions,
  }) => {
    const summarizeTransactions = (
      transactions: TransactionInter[]
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
		<ResponsiveContainer width='100%' height={400}>
			<LineChart
				data={chartData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='date' />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type='monotone'
					dataKey='totalValue'
					stroke='#8884d8'
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default TransactionTimeChart;
