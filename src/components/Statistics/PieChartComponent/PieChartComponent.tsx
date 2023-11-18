// PieChartComponent.tsx
import React from 'react';
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {dataMainType, ITransaction} from '../../Table/Table'; // Assuming you have this exported from another file

interface PieChartComponentProps {
	transactions: dataMainType[];
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
	transactions,
}) => {
	// Prepare the data for recharts
	const data = transactions.reduce(
		(acc: { name: string; value: number }[], transaction: dataMainType) => {
			const existingCategory = acc.find(
				(item) => item.name === transaction.category
			);
			if (existingCategory) {
				existingCategory.value += transaction.value;
			} else {
				acc.push({ name: transaction.category, value: transaction.value });
			}
			return acc;
		},
		[]
	);

	return (
		<ResponsiveContainer width="100%" height={250}>
			<PieChart width={100} height={200}>
				<Pie
					dataKey="value"
					data={data}
					outerRadius={100}
					fill="#8884d8"
					label={({ name, percent }: { name: string; percent: number }) =>
						`${name} ${(percent * 100).toFixed(0)}%`
					}
					>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
			</PieChart>
		</ResponsiveContainer>
		// <PieChart width={400} height={200}>
		// 	<Pie
		// 		data={data}
		// 		cx={200}
		// 		cy={100}
		// 		labelLine={false}
		// 		outerRadius={50}
		// 		fill='#8884d8'
		// 		dataKey='value'
		// 		label={({ name, percent }: { name: string; percent: number }) =>
		// 			`${name} ${(percent * 100).toFixed(0)}%`
		// 		}
		// 	>
		// 		{data.map((entry, index) => (
		// 			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
		// 		))}
		// 	</Pie>
		// 	<Tooltip />
		// </PieChart>
	);
};

export default PieChartComponent;
