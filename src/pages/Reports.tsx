import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Zap,
  MessageSquareWarning,
  Lightbulb,
  Calendar,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { weeklyReport } from '../data/mockData';
import { useAppStore } from '../store';

const PIE_COLORS = ['#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

export default function Reports() {
  const getFilteredDrones = useAppStore((state) => state.getFilteredDrones);
  const getFilteredRoutes = useAppStore((state) => state.getFilteredRoutes);
  const getFilteredModelStats = useAppStore((state) => state.getFilteredModelStats);
  const getFilteredProvinceData = useAppStore((state) => state.getFilteredProvinceData);

  const filteredDrones = getFilteredDrones();
  const filteredRoutes = getFilteredRoutes();
  const filteredModelStats = getFilteredModelStats();
  const filteredProvinceData = getFilteredProvinceData();

  const { complaintDistribution, optimizationRecommendations, week } = weeklyReport;

  const totalDeliveries = filteredProvinceData.reduce((sum, p) => sum + p.totalDeliveries, 0);
  const onTimeRate = filteredProvinceData.length > 0
    ? filteredProvinceData.reduce((sum, p) => sum + p.onTimeRate, 0) / filteredProvinceData.length
    : 0;
  const avgDelay = filteredProvinceData.length > 0
    ? filteredProvinceData.reduce((sum, p) => sum + p.avgDelay, 0) / filteredProvinceData.length
    : 0;

  const energyRanking = filteredModelStats.map((s) => ({
    model: s.model,
    kwhPerKm: Math.round(((100 - s.avgEfficiency) * 0.004 + 0.1) * 1000) / 1000,
  })).sort((a, b) => a.kwhPerKm - b.kwhPerKm);

  const deliveryStats = {
    total: totalDeliveries,
    onTimeRate: Math.round(onTimeRate * 10) / 10,
    avgDelay: Math.round(avgDelay * 10) / 10,
    weekOverWeek: 5.3,
    yearOverYear: 18.7,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">运营报告</h1>
          <p className="text-text-muted text-sm mt-1">
            自动生成的每周运营诊断报告
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4" />
            {week}
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="data-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">本周配送总量</p>
              <p className="stat-value mt-1">{deliveryStats.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-alert-green" />
                <span className="text-alert-green">+{deliveryStats.weekOverWeek}%</span>
                <span className="text-text-muted">环比</span>
                <span className="text-text-muted mx-1">|</span>
                <TrendingUp className="w-3 h-3 text-alert-green" />
                <span className="text-alert-green">+{deliveryStats.yearOverYear}%</span>
                <span className="text-text-muted">同比</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-tech-cyan/10">
              <FileBarChart className="w-6 h-6 text-tech-cyan" />
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">准时配送率</p>
              <p className="stat-value mt-1 text-alert-green">{deliveryStats.onTimeRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-alert-green" />
                <span className="text-alert-green">+2.1%</span>
                <span className="text-text-muted">较上周</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-alert-green/10">
              <TrendingUp className="w-6 h-6 text-alert-green" />
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">平均延误时长</p>
              <p className="stat-value mt-1">{deliveryStats.avgDelay}<span className="text-sm font-normal ml-1">分钟</span></p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingDown className="w-3 h-3 text-alert-green" />
                <span className="text-alert-green">-1.3分钟</span>
                <span className="text-text-muted">较上周</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-alert-amber/10">
              <TrendingDown className="w-6 h-6 text-alert-amber" />
            </div>
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">用户投诉量</p>
              <p className="stat-value mt-1">149</p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <TrendingDown className="w-3 h-3 text-alert-green" />
                <span className="text-alert-green">-12.4%</span>
                <span className="text-text-muted">较上周</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-alert-red/10">
              <MessageSquareWarning className="w-6 h-6 text-alert-red" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel">
          <div className="panel-header">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-tech-cyan" />
              机型能耗排名
            </h3>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={energyRanking} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="model"
                  type="category"
                  stroke="#64748B"
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} kWh/km`, '能耗']}
                />
                <Bar
                  dataKey="kwhPerKm"
                  name="能耗 (kWh/km)"
                  fill="#06B6D4"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-alert-amber" />
              用户投诉类型分布
            </h3>
          </div>
          <div className="panel-body">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={280}>
                <PieChart>
                  <Pie
                    data={complaintDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    paddingAngle={2}
                  >
                    {complaintDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {complaintDistribution.map((item, idx) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[idx] }}
                    />
                    <span className="text-sm text-text-secondary flex-1">{item.type}</span>
                    <span className="text-sm font-mono text-text-primary">{item.count}</span>
                    <span className="text-xs text-text-muted w-12 text-right">
                      {((item.count / 149) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-alert-amber" />
            优化建议
          </h3>
        </div>
        <div className="panel-body">
          <div className="space-y-3">
            {optimizationRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-deep-space/50 rounded-xl border-l-4 border-tech-cyan"
              >
                <div className="w-8 h-8 rounded-full bg-tech-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-tech-cyan font-bold">{idx + 1}</span>
                </div>
                <p className="text-text-primary pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
