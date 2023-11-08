// StatisticsPage.tsx
import React, { useState, useEffect } from 'react';
import PieChartComponent from '../PieChartComponent/PieChartComponent';
import TransactionTimeChart from '../TransactionTimeChart/TransactionTimeChart';
import {
	fetchTransactionsAsync,
	fetchTransCatsAsync,
} from '../../redux/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { ITransaction } from '../Table/Table';

const StatisticsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const transactions = useSelector(
		(state: RootState) => state.transactions.transactions
	);
	const [error, setError] = useState<string>('');
	const [period, setPeriod] = useState<'month' | 'year' | 'all'>('month');

	useEffect(() => {
		dispatch(fetchTransactionsAsync()).then(() =>
			dispatch(fetchTransCatsAsync())
		);
	}, [dispatch]);

	// Handle period change, possibly from a select dropdown or segmented control
	const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setPeriod(event.target.value as 'month' | 'year' | 'all');
	};

// Filter transactions based on the selected period
const filterTransactionsByPeriod = (
	transactions: ITransaction[],
	period: 'month' | 'year' | 'all'
  ) => {
	const now = new Date();
	return transactions.filter((transaction) => {
	  // Convert "DD.MM.YYYY" to a Date object
	  const parts = transaction.date.split('.');
	  const transactionDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));

	  switch (period) {
		case 'month':
		  return (
			transactionDate.getFullYear() === now.getFullYear() &&
			transactionDate.getMonth() === now.getMonth()
		  );
		case 'year':
		  return transactionDate.getFullYear() === now.getFullYear();
		case 'all':
		default:
		  return true; // No filtering for 'all'
	  }
	});
  };

	// Filter and sort transactions
	const filteredTransactions = filterTransactionsByPeriod(transactions, period);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div style={{ margin: '20px' }}>
			<h1>Site Statistics</h1>
			<section>
				<h2>Transactions Overview</h2>
				{transactions.length > 0 ? (
					<>
						<PieChartComponent transactions={filteredTransactions} />
						{/* Dropdown to select period */}
						<div>
							<label htmlFor='period-select'>Select period:</label>
							<select
								id='period-select'
								value={period}
								onChange={handlePeriodChange}
							>
								<option value='month'>Month</option>
								<option value='year'>Year</option>
								<option value='all'>All</option>
							</select>
						</div>
						<TransactionTimeChart transactions={filteredTransactions} period={'month'} />
					</>
				) : (
					<div>No transaction data available.</div>
				)}
			</section>
			<section>
				<h2>Transaction Time Analysis</h2>
				{/* Add UI elements for time analysis here */}
			</section>
		</div>
	);
};

export default StatisticsPage;
