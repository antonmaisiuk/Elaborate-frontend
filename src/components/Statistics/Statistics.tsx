import React, {FC, useEffect, useState} from 'react';
import PieChartComponent from './PieChartComponent/PieChartComponent';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {ITransaction} from '../Table/Table';
import Layout from "../Layout/Layout";
import Navigation, {NavInterface} from "../Navigation/Navigation";
import Content from "../Content/Content";
import Header from "../Header/Header";
import {StyledSelectorsBlock, StyledTitle} from "../Transactions/style";
import {setBuyerPeriod, setPeriod, StatPeriod} from "../../redux/statSlice";
import _ from "lodash";
import {StyledCharts, StyledSelector} from "./styled";
import {
	CartesianGrid, Legend, Line, LineChart,
	Tooltip, XAxis, YAxis
} from "recharts";
import {useTranslation} from "react-i18next";
import {StyledTile, StyledTileHeader, StyledTileTitle} from "../Overview/styled";
import {IBasicInvestment, IOtherInvestment} from "../Investments/Overview/InvestOverview";
import { StyledResponsiveContainer } from './TransactionTimeChart/style';
import {filterDataByPeriod} from "../Overview/Overview";
import BuyerPowerChart from "./BuyerPowerChart/BuyerPowerChart";
import {StyledFormControl} from "../Auth/styled";


export const getAllData = (actualPeriod: StatPeriod, trans: ITransaction[], basic: IBasicInvestment[], other: IOtherInvestment[]) => {
	const filtred = filterDataByPeriod(actualPeriod, [
		..._.map(trans, (item) => ({
			...item,
			type: 'Transactions',
		})),
		..._.map(basic, (item) => ({
			...item,
			type: 'Basic investments',
		})),
		..._.map(other, (item) => ({
			...item,
			type: 'Other investments',
		})),
	]);


	const result = _.map(_.groupBy(filtred, 'date'), (item) => item.reduce((accumulator, currentValue) => {
		const { type, value, date } = currentValue;

		if (!accumulator[type]) {
			accumulator[type] = 0;
		}

		accumulator[type] += value;
		accumulator['Date'] = date;

		return accumulator;
	}, {}));

	return result;
}


const Statistics: FC<NavInterface> = ({
																				visible,
																				toggle,
																			}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation();

	const actualPeriod = useSelector((state: RootState) => state.stats.period);
	const transLoadingStatus = useSelector((state: RootState) => state.transactions.transLoading);
	const basicLoadingStatus = useSelector((state: RootState) => state.basicInvestments.basicLoading);

	const transactions = useSelector((state: RootState) => state.transactions.transactions);
	const basicInvestments = useSelector((state: RootState) => state.basicInvestments.basicInvests);
	const otherInvestments = useSelector((state: RootState) => state.otherInvestments.otherInvests);

	const history = useSelector((state: RootState) => state.user.history);

	const [filteredTrans, setFilteredTrans] = useState<ITransaction[]>(transactions);
	const [filteredBasic, setFilteredBasic] = useState<IBasicInvestment[]>(basicInvestments);
	const [filteredOther, setFilteredOther] = useState<IOtherInvestment[]>(otherInvestments);


	useEffect(() => {
		if (transLoadingStatus && basicLoadingStatus) {
			setFilteredTrans(filterDataByPeriod(actualPeriod, transactions));
			setFilteredBasic(filterDataByPeriod(actualPeriod, basicInvestments));
			setFilteredOther(filterDataByPeriod(actualPeriod, otherInvestments));
		}
	}, [transactions, basicInvestments, otherInvestments]);

	const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setPeriod(event.target.value));
	};
	const handleBuyerPowerPeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setBuyerPeriod(event.target.value));
	};

	useEffect(() => {
		setFilteredTrans(filterDataByPeriod(actualPeriod, transactions));
		setFilteredBasic(filterDataByPeriod(actualPeriod, basicInvestments));
		setFilteredOther(filterDataByPeriod(actualPeriod, otherInvestments));
	}, [actualPeriod]);

	return (
		<Layout>
			<Header toggle={toggle} visible={visible}/>
			<Navigation toggle={toggle} visible={visible}/>
			<Content onClick={() => toggle(false)}>

				<StyledTileHeader>
					<StyledTitle>{t('statistics')}</StyledTitle>

					<StyledSelectorsBlock>
						<StyledSelector onChange={handlePeriodChange}>
							{
								_.keys(StatPeriod).map((period, i) =>
									(<option selected={actualPeriod === _.values(StatPeriod)[i]} value={period}>{_.values(StatPeriod)[i]}</option>))
							}
						</StyledSelector>
					</StyledSelectorsBlock>
				</StyledTileHeader>


				<StyledCharts>
					<StyledTile className={'tile_trans'}>
						<StyledTileHeader>
							<StyledTileTitle>
								{t('transactions')}
							</StyledTileTitle>
						</StyledTileHeader>
						<PieChartComponent items={filteredTrans} />
					</StyledTile>

					<StyledTile className={'tile_basic'}>
						<StyledTileHeader>
							<StyledTileTitle>
								{t('basic')}
							</StyledTileTitle>
						</StyledTileHeader>
						<PieChartComponent items={filteredBasic} />
					</StyledTile>

					<StyledTile className={'tile_other'}>
						<StyledTileHeader>
							<StyledTileTitle>
								{t('other')}
							</StyledTileTitle>
						</StyledTileHeader>
						<PieChartComponent items={filteredOther} />
					</StyledTile>

					<StyledTile className={'tile_history'}>
						<StyledTileHeader>
							<StyledTileTitle>
								{t('history')}
							</StyledTileTitle>
						</StyledTileHeader>
						<StyledResponsiveContainer>
							<LineChart
								width={500}
								height={300}
								data={filterDataByPeriod(actualPeriod, history)}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={['auto', 'auto']} />
								<Tooltip />
								<Legend />
								<Line type="monotone" strokeWidth={3} dataKey="value" stroke="#82ca9d" />
							</LineChart>
						</StyledResponsiveContainer>
					</StyledTile>

					<StyledTile className={'tile_power'}>
						<StyledTileHeader>
							<StyledTileTitle>
								{t('buyingPower')}
							</StyledTileTitle>
							<StyledSelectorsBlock>
								<StyledFormControl
									type="month"
									defaultValue={'2023-06'}
									max={'2023-11'}
									onChange={handleBuyerPowerPeriodChange}
								/>
							</StyledSelectorsBlock>
						</StyledTileHeader>
						<BuyerPowerChart />
					</StyledTile>

				</StyledCharts>


			</Content>
		</Layout>
	);
};

export default Statistics;
