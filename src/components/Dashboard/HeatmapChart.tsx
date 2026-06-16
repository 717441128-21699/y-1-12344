import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../../store';

export default function HeatmapChart() {
  const provinceData = useAppStore((state) => state.provinceData);
  const setSelectedProvince = useAppStore((state) => state.setSelectedProvince);

  const data = provinceData.map((p) => ({
    value: [p.center[0], p.center[1], p.onTimeRate],
    name: p.name,
    totalDeliveries: p.totalDeliveries,
    avgDelay: p.avgDelay,
    onTimeRate: p.onTimeRate,
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1E293B',
      borderColor: '#334155',
      textStyle: { color: '#F1F5F9' },
      formatter: (params: any) => {
        const d = params.data;
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 8px;">${d.name}</div>
            <div>准时率: <b style="color: #06B6D4">${d.onTimeRate.toFixed(1)}%</b></div>
            <div>配送总量: <b>${d.totalDeliveries.toLocaleString()}</b> 单</div>
            <div>平均延误: <b>${d.avgDelay.toFixed(1)}</b> 分钟</div>
          </div>
        `;
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'value',
      min: 73,
      max: 136,
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 18,
      max: 54,
      show: false,
    },
    visualMap: {
      min: 75,
      max: 100,
      left: 20,
      bottom: 20,
      text: ['准时率高', '准时率低'],
      textStyle: { color: '#94A3B8', fontSize: 11 },
      inRange: {
        color: ['#EF4444', '#F59E0B', '#06B6D4', '#10B981'],
      },
      calculable: true,
      dimension: 2,
    },
    series: [
      {
        name: '准时率',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: data,
        symbolSize: (val: any) => Math.sqrt(val.totalDeliveries) / 3 + 12,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
        },
        label: {
          show: true,
          formatter: (params: any) => params.data.name,
          position: 'right',
          color: '#F1F5F9',
          fontSize: 11,
        },
        itemStyle: {
          color: (params: any) => {
            const rate = params.data.onTimeRate;
            if (rate >= 95) return '#10B981';
            if (rate >= 85) return '#06B6D4';
            if (rate >= 78) return '#F59E0B';
            return '#EF4444';
          },
          shadowBlur: 15,
          shadowColor: 'rgba(6, 182, 212, 0.4)',
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '450px', width: '100%' }}
      onEvents={{
        click: (params: any) => {
          if (params.data && params.data.name) {
            setSelectedProvince(params.data.name);
          }
        },
      }}
    />
  );
}
