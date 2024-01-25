import React from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';
import {dataMainType, ITransaction} from '../../Table/Table';
import {StyledNoData} from "../styled";
import _ from "lodash";
import {IBasicInvestment, IOtherInvestment} from "../../Investments/Overview/InvestOverview";
import {StyledPieResponsiveContainer} from "../TransactionTimeChart/style";

interface PieChartComponentProps {
  items: dataMainType[];
}

const COLORS = [
  "#6ab1f0",
  "#7ed17e",
  "#f29191",
  "#f5c36f",
  "#c792e8",
  "#95a5a6",
  "#82e2d4",
  "#f3a683",
  "#e57e25",
  "#82d8a7",
  "#e74c3c",
  "#bdc3c7",
  "#ecf0f1",
  "#5d8aa8",
  "#4d9c5d"
];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
                                                               items,
                                                             }) => {
  const data = items.reduce(
    (acc: { name: string; value: number }[], item: dataMainType | IOtherInvestment) => {
      let isOtherInvest = !_.has(item, 'category');

      const existingCategory = acc.find(
        (i) => !isOtherInvest ? i.name === (item as ITransaction | IBasicInvestment).category : i.name === (item as IOtherInvestment).title
      );

      if (existingCategory) {
        existingCategory.value += _.round(item.value, 2);
      } else {
        !isOtherInvest
          ? acc.push({name: (item as ITransaction | IBasicInvestment).category, value: _.round(item.value, 2)})
          : acc.push({name: (item as IOtherInvestment).title, value: _.round(item.value, 2)});
      }

      return acc;
    },
    []
  );

  return (
    data.length ?
      <StyledPieResponsiveContainer>
        <PieChart
          width={500}
          height={300}
        >
          <Pie
            dataKey="value"
            data={data}
            legendType={'square'}
            outerRadius={90}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip contentStyle={{backgroundColor: '#e0ebe3e6', border: 'none', borderRadius: '8px', color: '#fff'}}/>
          <Legend/>
        </PieChart>
      </StyledPieResponsiveContainer>
      :
      <StyledNoData>Sorry, but you don't have data for current period(</StyledNoData>
  );
};

export default PieChartComponent;
