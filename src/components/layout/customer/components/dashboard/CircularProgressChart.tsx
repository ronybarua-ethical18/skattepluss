'use client';
import dynamic from 'next/dynamic';
import React from 'react';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ApexChartProps {
  series?: number[];
  label?: string;
  trackBg?: string;
  color?: string;
  height?: number;
  hollowSize?: string;
}

const CircularProgressChart: React.FC<ApexChartProps> = ({
  series = [45],
  height = 80,
  trackBg = '#85E0A366',
  color = '#00B386',
}) => {
  const options = {
    chart: {
      type: 'radialBar' as const,
    },
    colors: [color],
    plotOptions: {
      radialBar: {
        track: {
          background: trackBg,
          strokeWidth: '100%', // Adjusting background circle width
        },
        hollow: {
          size: '40%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            formatter: (val: number) => `${val}%`,
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#101010',
            offsetY: 4,
          },
        },
      },
    },
  };

  return (
    <div id="chart">
      <Chart
        options={{ ...options }}
        series={series}
        type="radialBar"
        height={height}
        width={height}
      />
    </div>
  );
};

export default CircularProgressChart;
