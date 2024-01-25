import React, {useEffect, useState} from 'react';
import {
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import _ from "lodash";
import {IBasicInvestment, IOtherInvestment} from "../../Investments/Overview/InvestOverview";
import {
  StyledBarResponsiveContainer,
} from "../TransactionTimeChart/style";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {getCustomExchangeRate} from "../../../redux/userSlice"; // Assuming you have this exported from another file

interface CustomTooltipType {
  value: Number,
  inf: number,
  date: string,
}

const getTotalInvestValue = (invests: (IBasicInvestment | IOtherInvestment)[], rate: number) => _.round(invests.reduce((accumulator, currentValue) => {
  return accumulator + (currentValue.value * rate)
}, 0), 2);

const getBuyingPowerData = (totalInvestValue: number, actualBuyerPeriod: string, inflation: { value: any, date: string}[]) => {
  const now = moment().startOf('M').subtract(1, 'M');
  let start = moment(actualBuyerPeriod);

  const data: CustomTooltipType[] = [];
  let x0 = totalInvestValue;
  while (!start.isSame(now)) {
    const currentInfl = _.head(_.filter(inflation, ({ date }) =>  date === moment(start).format('DD.MM.YYYY')));

    if (!currentInfl) {
      start = moment(start).add(1, 'M');
    } else {
      const { value: infValue, date: infDate} = currentInfl;

      const power = _.round((x0 * ((100 - infValue) / 100)) + x0, 2);
      data.push({
        value: power,
        inf: (100 - infValue),
        date: infDate,
      });

      x0 = power;
      start = moment(start).add(1, 'M');
    }
  }


  return data;
}

const BuyerPowerChart = () => {
  const actualBuyerPeriod = useSelector((state: RootState) => state.stats.buyerPeriod);
  const inflation = useSelector((state: RootState) => state.user.inflation);

  const invests = useSelector((state: RootState) => state.basicInvestments.basicInvests);
  const otherInvests = useSelector((state: RootState) => state.otherInvestments.otherInvests);

  const currentCurrencySlug = useSelector((state: RootState) => state.user.userInfo.currSlug);
  const [rate, setRate] = useState(1);

  const total = getTotalInvestValue([...invests, ...otherInvests], rate);

  const dataChart = getBuyingPowerData(total, actualBuyerPeriod, inflation);

  const getInflSum = () => Math.abs(_.round(_.sumBy(dataChart, (item) => item.inf),2));
  const getTotalPlusInfl = () => _.round(total + (total * (_.divide(getInflSum(), 100))),2);
  const getLastValue = () => _.last(dataChart)?.value;

  const { t } = useTranslation();

  useEffect(() => {

    async function getRate() {
      try {
        setRate(await getCustomExchangeRate(currentCurrencySlug, 'PLN'))
      } catch (err){

      }
    }
    getRate();

  }, []);



  return (
    <>
      <div>
        <p>{`Za kwotę: ${total} zł kupimy tyle co w ${actualBuyerPeriod} za kwotę ${getLastValue()}zł`}</p>
        <p>Inflacja skumulowana wyniosła: <b>{getInflSum()} %</b></p>
        <p>Aby kupić tyle samo towarów należałoby wydać <b>{getTotalPlusInfl()} zł</b></p>
      </div>

      <StyledBarResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={dataChart}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis domain={['auto', 'auto']}/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="value" fill="rgb(39, 178, 86)"/>
        </BarChart>
      </StyledBarResponsiveContainer>
    </>
  );
};

export default BuyerPowerChart;
