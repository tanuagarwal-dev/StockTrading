"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = {
  candles: Candle[];
};

export default function CandleChart({ candles }: Props) {
  const labels = candles.map((c) =>
    new Date(c.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: candles.map((c) => [c.low, c.high]),
        backgroundColor: candles.map((c) =>
          c.close >= c.open ? "rgba(34,197,94,0.7)" : "rgba(248,113,113,0.7)"
        ),
        borderColor: candles.map((c) =>
          c.close >= c.open ? "rgba(22,163,74,1)" : "rgba(220,38,38,1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const c = candles[ctx.dataIndex];
            if (!c) return "";
            return `O ${c.open.toFixed(2)}  H ${c.high.toFixed(
              2
            )}  L ${c.low.toFixed(2)}  C ${c.close.toFixed(2)}`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
}


