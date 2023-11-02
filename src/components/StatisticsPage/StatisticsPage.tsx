// StatisticsPage.tsx
import React, { useState, useEffect } from 'react';
import PieChartComponent from '../PieChartComponent/PieChartComponent';
import {
	fetchTransactionsAsync,
	fetchTransCatsAsync,
} from '../../redux/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { TransactionInter } from '../Table/Table';

const StatisticsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const transactions = useSelector(
		(state: RootState) => state.transactions.transactions
	);
	const [error, setError] = useState<string>('');


	useEffect(() => {
		dispatch(fetchTransactionsAsync()).then(() =>
			dispatch(fetchTransCatsAsync())
		);
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div style={{ margin: '20px' }}>
			<h1>Site Statistics</h1>
			<section>
				<h2>Transactions Overview</h2>
				{transactions.length > 0 ? (
					<PieChartComponent transactions={transactions} />
				) : (
					<div>No transaction data available.</div>
				)}
			</section>
			{/* Additional stats and components can be added here */}
		</div>
	);
};

export default StatisticsPage;
