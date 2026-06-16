import { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileCheck,
  AlertTriangle,
  Shield,
  Clock,
  Cloud,
  Lightbulb,
  Route,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { riskPredictions } from '../data/mockData';
import type { RiskPrediction } from '../types';

const riskColorMap = {
  low: { bg: 'bg-alert-green/10', text: 'text-alert-green', border: 'border-alert-green/30', label: '低风险' },
  medium: { bg: 'bg-alert-amber/10', text: 'text-alert-amber', border: 'border-alert-amber/30', label: '中风险' },
  high: { bg: 'bg-alert-red/10', text: 'text-alert-red', border: 'border-alert-red/30', label: '高风险' },
};

export default function Routes() {
  const [activeTab, setActiveTab] = useState<'upload' | 'prediction'>('upload');
  const [routeFile, setRouteFile] = useState<File | null>(null);
  const [airspaceFile, setAirspaceFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const highRiskCount = riskPredictions.filter((r) => r.riskLevel === 'high').length;
  const mediumRiskCount = riskPredictions.filter((r) => r.riskLevel === 'medium').length;

  const handleRouteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRouteFile(file);
      if (airspaceFile) setUploaded(true);
    }
  };

  const handleAirspaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAirspaceFile(file);
      if (routeFile) setUploaded(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">航线管理</h1>
          <p className="text-text-muted text-sm mt-1">
            上传航线计划与空域批文，预测高风险时段并获取方案建议
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-panel-bg rounded-xl w-fit border border-panel-border">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-tech-cyan text-deep-space'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            计划上传
          </span>
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'prediction'
              ? 'bg-tech-cyan text-deep-space'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            风险预测
          </span>
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="panel">
            <div className="panel-header">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-tech-cyan" />
                航线计划上传
              </h3>
            </div>
            <div className="panel-body">
              <label className="block">
                <div className="border-2 border-dashed border-panel-border rounded-xl p-8 text-center cursor-pointer hover:border-tech-cyan/50 transition-colors">
                  <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-primary font-medium">点击或拖拽上传Excel文件</p>
                  <p className="text-sm text-text-muted mt-1">支持 .xlsx, .xls 格式</p>
                  {routeFile && (
                    <div className="mt-4 p-3 bg-tech-cyan/10 rounded-lg inline-flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-tech-cyan" />
                      <span className="text-sm text-tech-cyan">{routeFile.name}</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleRouteUpload}
                />
              </label>

              <div className="mt-6 p-4 bg-deep-space/50 rounded-xl">
                <h4 className="text-sm font-medium text-text-primary mb-3">系统自动提取信息</h4>
                <div className="space-y-2 text-sm">
                  {uploaded ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          计划起降时间
                        </span>
                        <span className="text-text-primary font-mono">2026-06-17 08:00 - 18:00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          航线数量
                        </span>
                        <span className="text-text-primary">12 条</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <Route className="w-4 h-4" />
                          起降点
                        </span>
                        <span className="text-text-primary">18 个</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-text-muted text-center py-2">上传文件后自动解析</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-alert-green" />
                空域批文上传
              </h3>
            </div>
            <div className="panel-body">
              <label className="block">
                <div className="border-2 border-dashed border-panel-border rounded-xl p-8 text-center cursor-pointer hover:border-tech-cyan/50 transition-colors">
                  <Shield className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-primary font-medium">点击或拖拽上传空域批文</p>
                  <p className="text-sm text-text-muted mt-1">支持 PDF, PNG, JPG 格式</p>
                  {airspaceFile && (
                    <div className="mt-4 p-3 bg-alert-green/10 rounded-lg inline-flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-alert-green" />
                      <span className="text-sm text-alert-green">{airspaceFile.name}</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleAirspaceUpload}
                />
              </label>

              <div className="mt-6 p-4 bg-deep-space/50 rounded-xl">
                <h4 className="text-sm font-medium text-text-primary mb-3">禁飞区识别</h4>
                <div className="space-y-2">
                  {uploaded ? (
                    <>
                      {['北京首都机场周边', '上海虹桥机场航线', '军事管制区A-03'].map((zone, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-deep-space/50 rounded-lg"
                        >
                          <span className="text-sm text-text-secondary">{zone}</span>
                          <span className="badge-danger">禁飞</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-text-muted text-center py-2">上传文件后自动识别禁飞区</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {uploaded && (
            <div className="lg:col-span-2 panel">
              <div className="panel-header">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-alert-amber" />
                  智能优化方案推荐
                </h3>
              </div>
              <div className="panel-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-alert-green/5 border border-alert-green/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-alert-green/10">
                        <Route className="w-5 h-5 text-alert-green" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">方案一：最优绕飞</h4>
                        <p className="text-sm text-text-secondary mt-1">
                          绕开3处禁飞区，增加航程8.5km，预计延长飞行时间12分钟，整体准时率95.2%
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className="text-text-muted">能耗增加: <span className="text-alert-amber">+6.8%</span></span>
                          <span className="text-text-muted">风险等级: <span className="text-alert-green">低</span></span>
                        </div>
                        <button className="btn-primary mt-4 text-sm py-1.5">采用此方案</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-tech-cyan/5 border border-tech-cyan/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-tech-cyan/10">
                        <Clock className="w-5 h-5 text-tech-cyan" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">方案二：延迟起飞</h4>
                        <p className="text-sm text-text-secondary mt-1">
                          将下午14:00-16:00航班推迟至18:00后起飞，避开雷阵雨天气，无需调整航线
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className="text-text-muted">准时率: <span className="text-alert-green">98.1%</span></span>
                          <span className="text-text-muted">用户影响: <span className="text-alert-amber">18单延迟</span></span>
                        </div>
                        <button className="btn-secondary mt-4 text-sm py-1.5">采用此方案</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="data-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold font-mono text-text-primary">{highRiskCount}</p>
                  <p className="text-sm text-alert-red mt-1">高风险时段</p>
                </div>
                <div className="p-3 rounded-xl bg-alert-red/10">
                  <AlertTriangle className="w-6 h-6 text-alert-red" />
                </div>
              </div>
            </div>
            <div className="data-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold font-mono text-text-primary">{mediumRiskCount}</p>
                  <p className="text-sm text-alert-amber mt-1">中风险时段</p>
                </div>
                <div className="p-3 rounded-xl bg-alert-amber/10">
                  <Cloud className="w-6 h-6 text-alert-amber" />
                </div>
              </div>
            </div>
            <div className="data-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold font-mono text-text-primary">
                    {48 - highRiskCount - mediumRiskCount}
                  </p>
                  <p className="text-sm text-alert-green mt-1">安全飞行窗口</p>
                </div>
                <div className="p-3 rounded-xl bg-alert-green/10">
                  <Shield className="w-6 h-6 text-alert-green" />
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="font-semibold text-text-primary">未来48小时风险预测时间线</h3>
                <p className="text-xs text-text-muted mt-0.5">基于历史气象数据智能预测</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-max pb-2">
                  {riskPredictions.map((risk: RiskPrediction, idx) => (
                    <div
                      key={idx}
                      className={`w-16 flex-shrink-0 rounded-lg p-2 border transition-all hover:scale-105 ${riskColorMap[risk.riskLevel].bg} ${riskColorMap[risk.riskLevel].border}`}
                    >
                      <p className={`text-xs font-mono text-center ${riskColorMap[risk.riskLevel].text}`}>
                        {risk.time}
                      </p>
                      <div className={`my-2 flex justify-center`}>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            risk.riskLevel === 'high'
                              ? 'bg-alert-red animate-pulse'
                              : risk.riskLevel === 'medium'
                              ? 'bg-alert-amber'
                              : 'bg-alert-green'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                      </div>
                      <p className="text-[10px] text-center text-text-secondary truncate">
                        {risk.weatherCondition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-text-primary">高风险时段详情</h4>
                {riskPredictions
                  .filter((r) => r.riskLevel === 'high')
                  .map((risk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-alert-red/5 border border-alert-red/20 rounded-xl"
                    >
                      <div className="p-2.5 rounded-lg bg-alert-red/10">
                        <AlertTriangle className="w-5 h-5 text-alert-red animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-text-primary">{risk.time}</span>
                          <span className="badge-danger">{riskColorMap.high.label}</span>
                          <span className="text-sm text-text-secondary">{risk.weatherCondition}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                          <span>风速: {risk.windSpeed} km/h</span>
                          <span>能见度: {risk.visibility} km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-alert-amber flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          {risk.recommendation}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
