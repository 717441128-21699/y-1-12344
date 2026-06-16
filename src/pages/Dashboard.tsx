import { Package, Clock, Battery, AlertTriangle, Zap, Users } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import HeatmapChart from '../components/Dashboard/HeatmapChart';
import FailureRanking from '../components/Dashboard/FailureRanking';
import DrillDownPanel from '../components/Dashboard/DrillDownPanel';
import { useAppStore } from '../store';
import { droneModelStats } from '../data/mockData';

export default function Dashboard() {
  const { selectedDroneModel, setSelectedDroneModel } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">运营总览</h1>
          <p className="text-text-muted text-sm mt-1">
            实时监控全国无人机物流配送运营状态
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">筛选机型:</span>
          <select
            value={selectedDroneModel || ''}
            onChange={(e) => setSelectedDroneModel(e.target.value || null)}
            className="input-field w-52 h-9 text-sm"
          >
            <option value="">全部机型</option>
            {droneModelStats.map((m) => (
              <option key={m.model} value={m.model}>
                {m.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="今日配送总量"
          value="2,847"
          icon={Package}
          change={5.2}
          color="cyan"
        />
        <StatCard
          label="准时配送率"
          value="91.3%"
          icon={Clock}
          change={1.8}
          color="green"
        />
        <StatCard
          label="平均电池健康"
          value="84.7%"
          icon={Battery}
          change={-0.5}
          color="amber"
        />
        <StatCard
          label="活跃预警"
          value="4"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          label="能耗效率"
          value="0.18 kWh/km"
          icon={Zap}
          change={2.3}
          color="cyan"
        />
        <StatCard
          label="用户满意度"
          value="94.2%"
          icon={Users}
          change={0.8}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 panel">
          <div className="panel-header">
            <div>
              <h3 className="font-semibold text-text-primary">全国配送时效热力图</h3>
              <p className="text-xs text-text-muted mt-0.5">
                点击省份可查看片区详细分析
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-info">实时</span>
            </div>
          </div>
          <div className="panel-body">
            <HeatmapChart />
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="font-semibold text-text-primary">机型故障率排名</h3>
              <p className="text-xs text-text-muted mt-0.5">电池健康度对比</p>
            </div>
          </div>
          <div className="panel-body">
            <FailureRanking />
          </div>
        </div>
      </div>

      <DrillDownPanel />
    </div>
  );
}
