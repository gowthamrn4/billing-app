import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { ChartColors } from "../../config/theme";
const ChartData = require("../../data/chart.json");

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type ChartType = {
  label: string;
  data: number[];
  backgroundColor: string;
};

type ChartData = {
  name: string;
  sales: number[];
};

const Chart = () => {
  const [chartData, setChartData] = useState<ChartType[]>([]);
  useEffect(() => {
    if (ChartData?.products) {
      const data = ChartData?.products as ChartData[];
      setChartData(
        data.map((item, index) => {
          return {
            label: item.name,
            data: item.sales,
            backgroundColor: ChartColors[index],
          };
        })
      );
    }
  }, [ChartData]);
  return <Bar options={options} data={{
    labels,
    datasets: chartData
  }} />;
};

export default Chart;
