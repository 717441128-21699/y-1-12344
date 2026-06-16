import { useState } from 'react';
import {
  Plane,
  Battery,
  Gauge,
  Package,
  MapPin,
  Activity,
  Zap,
  ThermometerSun,
  Wind,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../store';
import { weatherData } from '../data/mockData';
import type { Drone as DroneType } from '../types';

const statusConfig = {
  flying: { label: '飞行中', color: 'bg-alert-green', text: 'text-alert-green' },
  idle: { label: '空闲', color: 'bg-tech-cyan', text: 'text-tech-cyan' },
  charging: { label: '充电中', color: 'bg-alert-amber', text: 'text-alert-amber' },
  maintenance: { label: '维护中', color: 'bg-text-muted', text: 'text-text-muted' },
  warning: { label: '预警', color: 'bg-alert-red', text: 'text-alert-red' },
};

export default function Monitoring() {
  const getFilteredDrones = useAppStore((state) => state.getFilteredDrones);
  const drones = getFilteredDrones();
  const [selectedDrone, setSelectedDrone] = useState<DroneType | null>(drones[0] || null);
  const [statusFilter, setStatusFilter] = useState<DroneType['status'] | 'all'>('all');

  const filteredDrones = drones.filter((d) =>
    statusFilter === 'all' ? true : d.status === statusFilter
  );

  const flyingCount = drones.filter((d) => d.status === 'flying').length;
  const idleCount = drones.filter((d) => d.status === 'idle').length;
  const warningCount = drones.filter((d) => d.status === 'warning').length;
  const avgBattery = drones.length > 0 ? drones.reduce((sum, d) => sum + d.currentBattery, 0) / drones.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">实时监测</h1>
          <p className="text-text-muted text-sm mt-1">
            实时监控全国无人机飞行状态与气象数据
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DroneType['status'] | 'all')}
            className="input-field w-40 h-9 text-sm"
          >
            <option value="all">全部状态</option>
            <option value="flying">飞行中</option>
            <option value="idle">空闲</option>
            <option value="charging">充电中</option>
            <option value="maintenance">维护中</option>
            <option value="warning">预警</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-alert-green/10">
              <Activity className="w-5 h-5 text-alert-green" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">{flyingCount}</p>
              <p className="text-xs text-text-secondary">飞行中</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-tech-cyan/10">
              <Plane className="w-5 h-5 text-tech-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">{idleCount}</p>
              <p className="text-xs text-text-secondary">空闲待命</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-alert-red/10">
              <Eye className="w-5 h-5 text-alert-red" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">{warningCount}</p>
              <p className="text-xs text-text-secondary">预警状态</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-alert-amber/10">
              <Battery className="w-5 h-5 text-alert-amber" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">{avgBattery.toFixed(0)}%</p>
              <p className="text-xs text-text-secondary">平均电量</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 panel">
          <div className="panel-header">
            <div>
              <h3 className="font-semibold text-text-primary">无人机状态监控</h3>
              <p className="text-xs text-text-muted mt-0.5">
                共 {filteredDrones.length} 架无人机
              </p>
            </div>
          </div>
          <div className="panel-body max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDrones.map((drone) => (
                <div
                  key={drone.id}
                  onClick={() => setSelectedDrone(drone)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDrone?.id === drone.id
                      ? 'border-tech-cyan bg-tech-cyan/5'
                      : 'border-panel-border hover:border-tech-cyan/50 bg-deep-space/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          statusConfig[drone.status].text.replace('text-', 'bg-')
                        }/10`}
                      >
                        <Plane className={`w-5 h-5 ${statusConfig[drone.status].text}`} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{drone.id}</p>
                        <p className="text-xs text-text-muted">{drone.model}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                        statusConfig[drone.status].text.replace('text-', 'bg-')
                      }/10 ${statusConfig[drone.status].text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig[drone.status].color} ${
                          drone.status === 'flying' ? 'animate-pulse' : ''
                        }`}
                      />
                      {statusConfig[drone.status].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Battery className="w-3.5 h-3.5 text-text-muted" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-text-muted">电量</span>
                          <span className="text-text-primary font-mono">{drone.currentBattery}%</span>
                        </div>
                        <div className="h-1 bg-panel-border rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${
                              drone.currentBattery > 50
                                ? 'bg-alert-green'
                                : drone.currentBattery > 20
                                ? 'bg-alert-amber'
                                : 'bg-alert-red'
                            }`}
                            style={{ width: `${drone.currentBattery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-text-muted" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-text-muted">健康</span>
                          <span
                            className={`font-mono ${
                              drone.batteryHealth > 80
                                ? 'text-alert-green'
                                : drone.batteryHealth > 70
                                ? 'text-alert-amber'
                                : 'text-alert-red'
                            }`}
                          >
                            {drone.batteryHealth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-secondary">
                        速度: <span className="text-text-primary font-mono">{drone.speed}</span> km/h
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-secondary">
                        载荷: <span className="text-text-primary font-mono">{drone.payload}</span> kg
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-panel-border flex items-center gap-1.5 text-xs text-text-muted">
                    <MapPin className="w-3 h-3" />
                    {drone.location.name}
                    <span className="ml-auto">{drone.province}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedDrone && (
            <div className="panel">
              <div className="panel-header">
                <h3 className="font-semibold text-text-primary">无人机详情</h3>
              </div>
              <div className="panel-body space-y-4">
                <div className="flex items-center gap-4 p-4 bg-deep-space/50 rounded-xl">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      statusConfig[selectedDrone.status].text.replace('text-', 'bg-')
                    }/10`}
                  >
                    <Plane className={`w-7 h-7 ${statusConfig[selectedDrone.status].text}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{selectedDrone.id}</p>
                    <p className="text-sm text-text-secondary">{selectedDrone.model}</p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs mt-1 px-2 py-0.5 rounded-full ${
                        statusConfig[selectedDrone.status].text.replace('text-', 'bg-')
                      }/10 ${statusConfig[selectedDrone.status].text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedDrone.status].color}`} />
                      {statusConfig[selectedDrone.status].label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <Battery className="w-3 h-3" />
                      当前电量
                    </div>
                    <p className="text-xl font-bold font-mono text-text-primary">
                      {selectedDrone.currentBattery}%
                    </p>
                  </div>
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <Activity className="w-3 h-3" />
                      电池健康
                    </div>
                    <p
                      className={`text-xl font-bold font-mono ${
                        selectedDrone.batteryHealth > 80
                          ? 'text-alert-green'
                          : selectedDrone.batteryHealth > 70
                          ? 'text-alert-amber'
                          : 'text-alert-red'
                      }`}
                    >
                      {selectedDrone.batteryHealth}%
                    </p>
                  </div>
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <Gauge className="w-3 h-3" />
                      飞行速度
                    </div>
                    <p className="text-xl font-bold font-mono text-text-primary">
                      {selectedDrone.speed}
                      <span className="text-sm font-normal text-text-muted ml-1">km/h</span>
                    </p>
                  </div>
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <Package className="w-3 h-3" />
                      运载重量
                    </div>
                    <p className="text-xl font-bold font-mono text-text-primary">
                      {selectedDrone.payload}
                      <span className="text-sm font-normal text-text-muted ml-1">kg</span>
                    </p>
                  </div>
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <Zap className="w-3 h-3" />
                      飞行高度
                    </div>
                    <p className="text-xl font-bold font-mono text-text-primary">
                      {selectedDrone.altitude || 0}
                      <span className="text-sm font-normal text-text-muted ml-1">m</span>
                    </p>
                  </div>
                  <div className="p-3 bg-deep-space/30 rounded-lg">
                    <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      所在省份
                    </div>
                    <p className="text-xl font-bold text-text-primary">{selectedDrone.province}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="panel">
            <div className="panel-header">
              <h3 className="font-semibold text-text-primary">全国气象监测</h3>
            </div>
            <div className="panel-body max-h-80 overflow-y-auto space-y-2">
              {weatherData.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 p-3 bg-deep-space/30 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-tech-cyan/10 flex items-center justify-center">
                    {w.condition === 'sunny' && <ThermometerSun className="w-5 h-5 text-alert-amber" />}
                    {w.condition === 'cloudy' && <ThermometerSun className="w-5 h-5 text-text-secondary" />}
                    {w.condition === 'rainy' && <Wind className="w-5 h-5 text-tech-cyan" />}
                    {w.condition === 'stormy' && <Wind className="w-5 h-5 text-alert-red" />}
                    {w.condition === 'foggy' && <Wind className="w-5 h-5 text-text-muted" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{w.province}</p>
                    <p className="text-xs text-text-muted">
                      {w.temperature.toFixed(0)}°C · 风速 {w.windSpeed.toFixed(0)} km/h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-text-primary">
                      能见度 {w.visibility.toFixed(1)}km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
