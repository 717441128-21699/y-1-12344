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
import { useAppStore } from '../store';
import type { RiskPrediction, RoutePlanResult, UploadedRoutePlan, UploadedAirspaceDoc } from '../types';

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const routePlanTemplates: UploadedRoutePlan[] = [
  { fileName: '', routeCount: 8, takeoffPoints: 12, plannedTime: '2026-06-17 08:00 - 18:00', routes: [{ name: 'A01', takeoff: '配送中心', landing: '东区站' }, { name: 'A02', takeoff: '配送中心', landing: '西区站' }] },
  { fileName: '', routeCount: 15, takeoffPoints: 22, plannedTime: '2026-06-17 06:00 - 20:00', routes: [{ name: 'B01', takeoff: '物流园', landing: '南郊站' }, { name: 'B02', takeoff: '物流园', landing: '北站' }] },
  { fileName: '', routeCount: 6, takeoffPoints: 9, plannedTime: '2026-06-17 09:00 - 17:00', routes: [{ name: 'C01', takeoff: '中转站', landing: '开发区' }, { name: 'C02', takeoff: '中转站', landing: '大学城' }] },
  { fileName: '', routeCount: 20, takeoffPoints: 28, plannedTime: '2026-06-17 05:00 - 22:00', routes: [{ name: 'D01', takeoff: '枢纽站', landing: '机场' }, { name: 'D02', takeoff: '枢纽站', landing: '工业园区' }] },
];

const airspaceTemplates: UploadedAirspaceDoc[] = [
  { fileName: '', noFlyZones: ['北京首都机场周边', '上海虹桥机场航线', '军事管制区A-03'], validPeriod: '2026-06-17 至 2026-06-30', restrictions: ['高度限制120m以下', '夜间禁止飞行'] },
  { fileName: '', noFlyZones: ['深圳宝安机场航路', '军事演习区B-12', '政府机关上空'], validPeriod: '2026-06-15 至 2026-07-15', restrictions: ['仅限工作日飞行', '风速>15m/s禁飞'] },
  { fileName: '', noFlyZones: ['成都双流机场管制区', '人口密集区C-07'], validPeriod: '2026-06-18 至 2026-06-25', restrictions: ['高度限制80m以下', '单次飞行不超过30分钟'] },
  { fileName: '', noFlyZones: ['杭州萧山机场进近区', '西湖风景区', '军事管制区D-01'], validPeriod: '2026-06-16 至 2026-07-01', restrictions: ['景区周边限速60km/h', '暴雨天气自动禁飞'] },
];

const resultTemplates: RoutePlanResult[] = [
  {
    noFlyZones: ['北京首都机场周边', '上海虹桥机场航线', '军事管制区A-03'],
    plannedTime: '2026-06-17 08:00 - 18:00',
    routeCount: 8, takeoffPointCount: 12,
    riskPredictions: riskPredictions.slice(0, 12),
    recommendations: [
      { type: 'detour', title: '方案一：最优绕飞', description: '绕开3处禁飞区，增加航程8.5km，预计延长飞行时间12分钟，整体准时率95.2%', extraInfo: [{ label: '能耗增加', value: '+6.8%', color: 'text-alert-amber' }, { label: '风险等级', value: '低', color: 'text-alert-green' }], approved: false },
      { type: 'delay', title: '方案二：延迟起飞', description: '将下午14:00-16:00航班推迟至18:00后起飞，避开雷阵雨天气，无需调整航线', extraInfo: [{ label: '准时率', value: '98.1%', color: 'text-alert-green' }, { label: '用户影响', value: '18单延迟', color: 'text-alert-amber' }], approved: false },
    ],
  },
  {
    noFlyZones: ['深圳宝安机场航路', '军事演习区B-12', '政府机关上空'],
    plannedTime: '2026-06-17 06:00 - 20:00',
    routeCount: 15, takeoffPointCount: 22,
    riskPredictions: riskPredictions.slice(0, 24),
    recommendations: [
      { type: 'detour', title: '方案一：南线绕飞', description: '绕开宝安航路和军事区，增加航程15km，需增派2架无人机', extraInfo: [{ label: '能耗增加', value: '+12.3%', color: 'text-alert-red' }, { label: '风险等级', value: '中', color: 'text-alert-amber' }], approved: false },
      { type: 'delay', title: '方案二：分时段避让', description: '上午6-10点执行全部航线，10-14点暂停，14点后恢复飞行', extraInfo: [{ label: '准时率', value: '87.5%', color: 'text-alert-amber' }, { label: '用户影响', value: '32单延迟', color: 'text-alert-red' }], approved: false },
    ],
  },
  {
    noFlyZones: ['成都双流机场管制区', '人口密集区C-07'],
    plannedTime: '2026-06-17 09:00 - 17:00',
    routeCount: 6, takeoffPointCount: 9,
    riskPredictions: riskPredictions.slice(0, 8),
    recommendations: [
      { type: 'detour', title: '方案一：低空穿越', description: '利用管制区边缘80m以下空域穿越，航程增加3km', extraInfo: [{ label: '能耗增加', value: '+2.1%', color: 'text-alert-green' }, { label: '风险等级', value: '低', color: 'text-alert-green' }], approved: false },
      { type: 'delay', title: '方案二：错峰运行', description: '将密集区航线调整至上午执行，下午仅执行外围航线', extraInfo: [{ label: '准时率', value: '96.8%', color: 'text-alert-green' }, { label: '用户影响', value: '5单延迟', color: 'text-alert-amber' }], approved: false },
    ],
  },
  {
    noFlyZones: ['杭州萧山机场进近区', '西湖风景区', '军事管制区D-01'],
    plannedTime: '2026-06-17 05:00 - 22:00',
    routeCount: 20, takeoffPointCount: 28,
    riskPredictions: riskPredictions.slice(0, 36),
    recommendations: [
      { type: 'detour', title: '方案一：大范围绕飞', description: '绕开风景区和军事区，增加航程22km，需增派4架无人机', extraInfo: [{ label: '能耗增加', value: '+18.5%', color: 'text-alert-red' }, { label: '风险等级', value: '低', color: 'text-alert-green' }], approved: false },
      { type: 'delay', title: '方案二：限速穿越风景区', description: '景区周边限速60km/h，暂停景区核心区航线，改用地面配送', extraInfo: [{ label: '准时率', value: '82.3%', color: 'text-alert-amber' }, { label: '用户影响', value: '45单延迟', color: 'text-alert-red' }], approved: false },
    ],
  },
];

const riskColorMap = {
  low: { bg: 'bg-alert-green/10', text: 'text-alert-green', border: 'border-alert-green/30', label: '低风险' },
  medium: { bg: 'bg-alert-amber/10', text: 'text-alert-amber', border: 'border-alert-amber/30', label: '中风险' },
  high: { bg: 'bg-alert-red/10', text: 'text-alert-red', border: 'border-alert-red/30', label: '高风险' },
};

export default function Routes() {
  const [activeTab, setActiveTab] = useState<'upload' | 'prediction'>('upload');
  const [routeFile, setRouteFile] = useState<File | null>(null);
  const [airspaceFile, setAirspaceFile] = useState<File | null>(null);

  const uploadedRoutePlan = useAppStore((state) => state.uploadedRoutePlan);
  const uploadedAirspaceDoc = useAppStore((state) => state.uploadedAirspaceDoc);
  const setUploadedRoutePlan = useAppStore((state) => state.setUploadedRoutePlan);
  const setUploadedAirspaceDoc = useAppStore((state) => state.setUploadedAirspaceDoc);
  const clearUploads = useAppStore((state) => state.clearUploads);
  const approvals = useAppStore((state) => state.approvals);

  const uploaded = !!uploadedRoutePlan && !!uploadedAirspaceDoc;

  const routePlanResult: RoutePlanResult | null = (() => {
    if (!uploadedRoutePlan || !uploadedAirspaceDoc) return null;
    const h = hashStr((routeFile?.name || '') + (airspaceFile?.name || ''));
    return resultTemplates[h % resultTemplates.length];
  })();

  const highRiskCount = riskPredictions.filter((r) => r.riskLevel === 'high').length;
  const mediumRiskCount = riskPredictions.filter((r) => r.riskLevel === 'medium').length;

  const handleRouteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRouteFile(file);
      const h = hashStr(file.name);
      const template = routePlanTemplates[h % routePlanTemplates.length];
      setUploadedRoutePlan({ ...template, fileName: file.name });
    }
  };

  const handleAirspaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAirspaceFile(file);
      const h = hashStr(file.name);
      const template = airspaceTemplates[h % airspaceTemplates.length];
      setUploadedAirspaceDoc({ ...template, fileName: file.name });
    }
  };

  const handleReset = () => {
    setRouteFile(null);
    setAirspaceFile(null);
    clearUploads();
  };

  const getApprovalForRecommendation = (recIdx: number) => {
    if (!routePlanResult) return null;
    return approvals.find((a) => a.type === 'route_adjustment' && a.status !== 'rejected');
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
        {uploaded && (
          <button onClick={handleReset} className="btn-secondary text-sm">
            重新上传
          </button>
        )}
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
                  {uploadedRoutePlan ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          计划起降时间
                        </span>
                        <span className="text-text-primary font-mono">{uploadedRoutePlan.plannedTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          航线数量
                        </span>
                        <span className="text-text-primary">{uploadedRoutePlan.routeCount} 条</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-2">
                          <Route className="w-4 h-4" />
                          起降点
                        </span>
                        <span className="text-text-primary">{uploadedRoutePlan.takeoffPoints} 个</span>
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
                  {uploadedAirspaceDoc ? (
                    <>
                      {uploadedAirspaceDoc.noFlyZones.map((zone, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-deep-space/50 rounded-lg"
                        >
                          <span className="text-sm text-text-secondary">{zone}</span>
                          <span className="badge-danger">禁飞</span>
                        </div>
                      ))}
                      {uploadedAirspaceDoc.restrictions.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-alert-amber/5 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5 text-alert-amber" />
                          <span className="text-sm text-text-secondary">{r}</span>
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

          {uploaded && routePlanResult && (
            <div className="lg:col-span-2 panel">
              <div className="panel-header">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-alert-amber" />
                  智能优化方案推荐
                </h3>
              </div>
              <div className="panel-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routePlanResult.recommendations.map((rec, recIdx) => {
                    const relatedApproval = getApprovalForRecommendation(recIdx);
                    const canAdopt = !relatedApproval || relatedApproval.status === 'approved';
                    const Icon = rec.type === 'detour' ? Route : Clock;
                    const borderColor = rec.type === 'detour' ? 'alert-green' : 'tech-cyan';

                    return (
                      <div key={recIdx} className={`p-5 bg-${borderColor}/5 border border-${borderColor}/20 rounded-xl`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-lg bg-${borderColor}/10`}>
                            <Icon className={`w-5 h-5 text-${borderColor}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{rec.title}</h4>
                            <p className="text-sm text-text-secondary mt-1">
                              {rec.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs">
                              {rec.extraInfo.map((info, infoIdx) => (
                                <span key={infoIdx} className="text-text-muted">
                                  {info.label}: <span className={info.color}>{info.value}</span>
                                </span>
                              ))}
                            </div>
                            <button
                              className="btn-primary mt-4 text-sm py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!canAdopt}
                              title={!canAdopt ? '需审批通过后执行' : undefined}
                            >
                              {canAdopt ? '采用此方案' : '需审批通过后执行'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
