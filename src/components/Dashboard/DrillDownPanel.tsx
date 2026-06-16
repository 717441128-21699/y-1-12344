import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { X } from 'lucide-react';
import { useAppStore } from '../../store';
import { deliveryTrends, batteryDecayData, weatherImpactData } from '../../data/mockData';

export default function DrillDownPanel() {
  const selectedProvince = useAppStore((state) => state.selectedProvince);
  const setSelectedProvince = useAppStore((state) => state.setSelectedProvince);

  if (!selectedProvince) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-panel-bg border border-panel-border rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-panel-border">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {selectedProvince} - 片区详细分析
            </h3>
            <p className="text-sm text-text-muted mt-0.5">近7天配送趋势与数据分析</p>
          </div>
          <button
            onClick={() => setSelectedProvince(null)}
            className="p-2 rounded-lg hover:bg-panel-border/50 transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-deep-space/50 rounded-xl p-5">
              <h4 className="text-sm font-medium text-text-primary mb-4">
                近7天配送趋势
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={deliveryTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#F1F5F9' }}
                  />
                  <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="总配送"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: '#06B6D4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="onTime"
                    name="准时"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="delayed"
                    name="延误"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-deep-space/50 rounded-xl p-5">
              <h4 className="text-sm font-medium text-text-primary mb-4">
                电池健康度分布
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={batteryDecayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="healthRange" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="无人机数量"
                    fill="#06B6D4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-deep-space/50 rounded-xl p-5">
            <h4 className="text-sm font-medium text-text-primary mb-4">
              24小时气象影响时间线
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weatherImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                <Bar
                  yAxisId="left"
                  dataKey="deliveries"
                  name="配送量"
                  fill="#06B6D4"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="impact"
                  name="气象影响指数"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 3 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
