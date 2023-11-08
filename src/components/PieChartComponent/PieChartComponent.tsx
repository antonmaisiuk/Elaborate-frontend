// PieChartComponent.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ITransaction } from '../Table/Table'; // Assuming you have this exported from another file

interface PieChartComponentProps {
	transactions: ITransaction[];
}

const COLORS = [
	'#0088FE', // Vivid blue
	'#00C49F', // Light green
	'#FFBB28', // Orange
	'#FF8042', // Orange-red
	'#FF6384', // Pinkish
	'#36A2EB', // Lighter blue
	'#FFCE56', // Yellow
	'#4BC0C0', // Teal
	'#C9CB3C', // Olive green
	'#E040FB', // Bright purple
	'#7CDDDD', // Pale turquoise
	'#9966FF', // Amethyst
	'#FF6666', // Soft red
	'#39A275', // Medium green
	'#FF9F40', // Bright orange
	'#4D4D4D', // Grey
	'#99E6E6', // Light cyan
	'#CCCC52', // Brass
];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
	transactions,
}) => {
	// Prepare the data for recharts
	const data = transactions.reduce(
		(acc: { name: string; value: number }[], transaction: ITransaction) => {
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
		<PieChart width={800} height={400}>
			<Pie
				data={data}
				cx={400}
				cy={200}
				labelLine={false}
				outerRadius={160}
				fill='#8884d8'
				dataKey='value'
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
	);
};

export default PieChartComponent;
