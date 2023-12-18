import React, {FC, useEffect, useState} from 'react';
import PieChartComponent from './PieChartComponent/PieChartComponent';
import TransactionTimeChart from './TransactionTimeChart/TransactionTimeChart';
import {fetchTransactionsAsync, fetchTransCatsAsync,} from '../../redux/transactionSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {dataMainType} from '../Table/Table';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledSelectorsBlock, StyledTitle} from "../Transactions/style";
import {setPeriod, setType, StatPeriod, StatType} from "../../redux/statSlice";
import _ from "lodash";
import {fetchBasicInvestsAsync, fetchInvestCatsAsync, fetchItemsAsync} from "../../redux/basicInvestSlice";
import moment from "moment";
import {StyledChart, StyledCharts, StyledChartTitle, StyledSelector} from "./styled";
import {ResponsiveContainer} from "recharts";
import {useTranslation} from "react-i18next";
import {StyledTileHeader} from "../Overview/styled";
import {IOtherInvestment} from "../Investments/Overview/InvestOverview";

const Statistics: FC<NavInterface> = ({
																				visible,
																				toggle,
																			}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();

	const actualType = useSelector((state: RootState) => state.stats.type);
	const actualPeriod = useSelector((state: RootState) => state.stats.period);
	const transLoadingStatus = useSelector((state: RootState) => state.transactions.loading);
	const basicLoadingStatus = useSelector((state: RootState) => state.basicInvestments.loading);

	const transactions = useSelector((state: RootState) => state.transactions.transactions);
	const basicInvestments = useSelector((state: RootState) => state.basicInvestments.basicInvests);
	const otherInvestments = useSelector((state: RootState) => state.otherInvestments.otherInvests);
	// const [period, setPeriod] = useState<string>(statPeriods[0].name);
	// const [type, setType] = useState<string>(statTypes[0].name);
	const [filteredItems, setFilteredItems] = useState<dataMainType[]>(actualType === StatType.transactions ? transactions : basicInvestments);


	useEffect(() => {
		if (transLoadingStatus !== 'succeeded') {
			dispatch(fetchTransactionsAsync()).then(() =>
				dispatch(fetchTransCatsAsync())
			);
		}

		if (basicLoadingStatus !== 'succeeded') {
			dispatch(fetchItemsAsync()).then(() => {
				dispatch(fetchBasicInvestsAsync()).then(() => {
					dispatch(fetchInvestCatsAsync())
				})
			});
		}

		if (transLoadingStatus && basicLoadingStatus) {
			setFilteredItems(actualType === StatType.transactions ? transactions : basicInvestments)
		}

	}, [transactions, basicInvestments, otherInvestments]);

	// Handle period change, possibly from a select dropdown or segmented control
	const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		// console.log('👉 event.target.value: ', event.target.value);
		dispatch(setPeriod(event.target.value));
	};
	const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setType(event.target.value));
	};
	const filterItemsByPeriod = () => {
		const now = moment();
		// console.log('👉 type: ', type);
		// console.log('👉 StatType.investments: ', StatType.investments);
		const itemsToFilter: dataMainType[] = actualType === StatType.investments ? [...basicInvestments, ...otherInvestments] : transactions

		return itemsToFilter.filter((item: dataMainType) => {
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
				return true; // No filtering for 'all'
			}
		});
  };

	useEffect(() => {
		setFilteredItems(filterItemsByPeriod());
	}, [actualPeriod, actualType]);

	// Filter and sort transactions
	return (
		<Layout>
			<Header toggle={toggle} visible={visible}/>
			<Navigation toggle={toggle} visible={visible}/>
			<Content onClick={() => toggle(false)}>
				<StyledTileHeader>
					<StyledTitle>{t('statistics')}</StyledTitle>

					<StyledSelectorsBlock>
						<StyledSelector onChange={handleTypeChange}>
							{
								_.keys(StatType).map((type, i) =>
									(<option selected={actualType === _.values(StatType)[i]} value={type}>{_.values(StatType)[i]}</option>))
							}
						</StyledSelector>
						<StyledSelector onChange={handlePeriodChange}>
							{
								_.keys(StatPeriod).map((period, i) =>
									(<option selected={actualPeriod === _.values(StatPeriod)[i]} value={period}>{_.values(StatPeriod)[i]}</option>))
							}
						</StyledSelector>
					</StyledSelectorsBlock>
				</StyledTileHeader>


				<StyledCharts>
					<StyledChart>
						<StyledChartTitle>{t('pieChart')}</StyledChartTitle>
						<PieChartComponent items={filteredItems} />
					</StyledChart>
					{/*<StyledChart>*/}
					{/*	<StyledChartTitle>Area chart</StyledChartTitle>*/}
					{/*	<TransactionTimeChart transactions={filteredItems} period={actualPeriod} />*/}
					{/*</StyledChart>*/}

				</StyledCharts>


			</Content>
		</Layout>
	);
};

export default Statistics;
