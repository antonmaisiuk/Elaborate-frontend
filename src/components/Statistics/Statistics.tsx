import React, { useState, useEffect } from 'react';
import PieChartComponent from './PieChartComponent/PieChartComponent';
import TransactionTimeChart from './TransactionTimeChart/TransactionTimeChart';
import {
	fetchTransactionsAsync,
	fetchTransCatsAsync,
} from '../../redux/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Table, {ITransaction, TableType} from '../Table/Table';
import Layout from "../Layout/Layout";
import Navigation from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledTitle} from "../Transactions/style";
import moment from "moment";

const Statistics: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const transactions = useSelector((state: RootState) => state.transactions.transactions);
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
	return (
		<Layout>
			<Navigation/>
			<Content>
				<Header/>
				<StyledTitle>Statistics</StyledTitle>
				<PieChartComponent transactions={filterTransactionsByPeriod(transactions, period)} />

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
				<TransactionTimeChart transactions={filterTransactionsByPeriod(transactions, period)} period={'month'} />

			</Content>
		</Layout>
	);
};

export default Statistics;
