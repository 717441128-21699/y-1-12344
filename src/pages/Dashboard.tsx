import { Package, Clock, Battery, AlertTriangle, Zap, Users } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import HeatmapChart from '../components/Dashboard/HeatmapChart';
import FailureRanking from '../components/Dashboard/FailureRanking';
import DrillDownPanel from '../components/Dashboard/DrillDownPanel';
import { useAppStore } from '../store';

export default function Dashboard() {
  const { selectedDroneModel, setSelectedDroneModel, getFilteredDrones, getFilteredRoutes, getFilteredProvinceData, getFilteredModelStats, getFilteredWarnings } = useAppStore();

  const filteredDrones = getFilteredDrones();
  const filteredRoutes = getFilteredRoutes();
  const filteredProvinceData = getFilteredProvinceData();
  const filteredModelStats = getFilteredModelStats();
  const filteredWarnings = getFilteredWarnings();

  const totalDeliveries = filteredProvinceData.reduce((sum, p) => sum + p.totalDeliveries, 0);
  const onTimeRate = filteredProvinceData.length > 0
    ? filteredProvinceData.reduce((sum, p) => sum + p.onTimeRate, 0) / filteredProvinceData.length
    : 0;
  const avgBatteryHealth = filteredDrones.length > 0
    ? filteredDrones.reduce((sum, d) => sum + d.batteryHealth, 0) / filteredDrones.length
    : 0;
  const activeWarnings = filteredWarnings.filter((w) => w.status !== 'resolved').length;
  const avgEfficiency = filteredRoutes.length > 0
    ? filteredRoutes.reduce((sum, r) => sum + r.efficiency, 0) / filteredRoutes.length
    : 0;
  const satisfaction = onTimeRate > 90 ? 94 + (onTimeRate - 90) * 0.6 : 85 + (onTimeRate - 78) * 0.75;

  const energyConsumption = filteredModelStats.length > 0
    ? filteredModelStats.reduce((sum, s) => sum + (100 - s.avgEfficiency) * 0.004 + 0.1, 0) / filteredModelStats.length
    : 0.18;

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
            {filteredModelStats.map((m) => (
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
          value={totalDeliveries.toLocaleString()}
          icon={Package}
          change={5.2}
          color="cyan"
        />
        <StatCard
          label="准时配送率"
          value={`${onTimeRate.toFixed(1)}%`}
          icon={Clock}
          change={1.8}
          color="green"
        />
        <StatCard
          label="平均电池健康"
          value={`${avgBatteryHealth.toFixed(1)}%`}
          icon={Battery}
          change={-0.5}
          color="amber"
        />
        <StatCard
          label="活跃预警"
          value={activeWarnings}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          label="能耗效率"
          value={`${energyConsumption.toFixed(2)} kWh/km`}
          icon={Zap}
          change={2.3}
          color="cyan"
        />
        <StatCard
          label="用户满意度"
          value={`${satisfaction.toFixed(1)}%`}
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
            <HeatmapChart data={filteredProvinceData} />
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
            <FailureRanking data={filteredModelStats} />
          </div>
        </div>
      </div>

      <DrillDownPanel />
    </div>
  );
}
