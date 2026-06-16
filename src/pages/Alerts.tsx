import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  BatteryWarning,
  CloudRain,
  Plane,
  CheckCircle,
  Loader2,
  FileCheck,
  X,
} from 'lucide-react';
import { useAppStore } from '../store';
import type { Warning } from '../types';

const typeConfig = {
  timeout: { icon: Clock, label: '配送超时', color: 'danger' },
  battery: { icon: BatteryWarning, label: '电池健康', color: 'warning' },
  weather: { icon: CloudRain, label: '气象预警', color: 'warning' },
  airspace: { icon: Plane, label: '空域冲突', color: 'danger' },
} as const;

const levelConfig = {
  warning: { label: '预警', badge: 'badge-warning' },
  danger: { label: '严重', badge: 'badge-danger' },
  critical: { label: '紧急', badge: 'badge-danger' },
};

const statusConfig = {
  pending: { label: '待处理', icon: AlertTriangle, color: 'text-alert-amber' },
  handling: { label: '处理中', icon: Loader2, color: 'text-tech-cyan' },
  resolved: { label: '已解决', icon: CheckCircle, color: 'text-alert-green' },
};

export default function Alerts() {
  const warnings = useAppStore((state) => state.warnings);
  const handleWarning = useAppStore((state) => state.handleWarning);
  const createApproval = useAppStore((state) => state.createApproval);
  const user = useAppStore((state) => state.user);

  const [filter, setFilter] = useState<Warning['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Warning['type'] | 'all'>('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [approvalType, setApprovalType] = useState<'route_adjustment' | 'grounding'>('route_adjustment');
  const [approvalDescription, setApprovalDescription] = useState('');

  const filteredWarnings = warnings.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (typeFilter !== 'all' && w.type !== typeFilter) return false;
    return true;
  });

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  const openApprovalModal = (warning: Warning) => {
    setSelectedWarning(warning);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (!selectedWarning || !approvalDescription) return;
    createApproval({
      warningId: selectedWarning.id,
      type: approvalType,
      status: 'pending_captain',
      requestedBy: user.name,
      description: approvalDescription,
      province: selectedWarning.province,
    });
    handleWarning(selectedWarning.id, 'handling');
    setShowApprovalModal(false);
    setSelectedWarning(null);
    setApprovalDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">预警中心</h1>
          <p className="text-text-muted text-sm mt-1">
            一级预警自动推送，及时处置安全隐患
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Warning['type'] | 'all')}
            className="input-field w-40 h-9 text-sm"
          >
            <option value="all">全部类型</option>
            <option value="timeout">配送超时</option>
            <option value="battery">电池健康</option>
            <option value="weather">气象预警</option>
            <option value="airspace">空域冲突</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Warning['status'] | 'all')}
            className="input-field w-36 h-9 text-sm"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="handling">处理中</option>
            <option value="resolved">已解决</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['warning', 'danger', 'critical'] as const).map((level) => {
          const count = warnings.filter(
            (w) => w.level === level && w.status !== 'resolved'
          ).length;
          return (
            <div key={level} className="data-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${levelConfig[level].badge.replace('badge-', 'bg-').replace('/20', '/10')}`}>
                  <AlertTriangle className={`w-5 h-5 ${levelConfig[level].badge.includes('amber') ? 'text-alert-amber' : 'text-alert-red'}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-text-primary">{count}</p>
                  <p className="text-xs text-text-secondary">{levelConfig[level].label}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-alert-green/10">
              <CheckCircle className="w-5 h-5 text-alert-green" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-text-primary">
                {warnings.filter((w) => w.status === 'resolved').length}
              </p>
              <p className="text-xs text-text-secondary">已解决</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3 className="font-semibold text-text-primary">预警列表</h3>
          <span className="text-sm text-text-secondary">
            共 {filteredWarnings.length} 条记录
          </span>
        </div>
        <div className="divide-y divide-panel-border">
          {filteredWarnings.map((warning) => {
            const TypeIcon = typeConfig[warning.type].icon;
            const StatusIcon = statusConfig[warning.status].icon;
            return (
              <div
                key={warning.id}
                className={`p-5 hover:bg-deep-space/30 transition-colors ${
                  warning.status === 'pending' ? 'bg-alert-red/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      typeConfig[warning.type].color === 'danger'
                        ? 'bg-alert-red/10'
                        : 'bg-alert-amber/10'
                    }`}
                  >
                    <TypeIcon
                      className={`w-6 h-6 ${
                        typeConfig[warning.type].color === 'danger'
                          ? 'text-alert-red'
                          : 'text-alert-amber'
                      } ${warning.status === 'pending' ? 'animate-pulse' : ''}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-text-primary">
                            {warning.description}
                          </h4>
                          <span className={levelConfig[warning.level].badge}>
                            {levelConfig[warning.level].label}
                          </span>
                          <span
                            className={typeConfig[warning.type].color === 'danger' ? 'badge-danger' : 'badge-warning'}
                          >
                            {typeConfig[warning.type].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                          <span>预警ID: {warning.id}</span>
                          <span>省份: {warning.province}</span>
                          {warning.droneId && <span>无人机: {warning.droneId}</span>}
                          {warning.consecutiveCount && (
                            <span className="text-alert-red">
                              连续 {warning.consecutiveCount} 次
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimeAgo(warning.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1 text-sm ${statusConfig[warning.status].color}`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 ${warning.status === 'handling' ? 'animate-spin' : ''}`}
                          />
                          {statusConfig[warning.status].label}
                        </span>
                      </div>
                    </div>
                    {warning.status === 'pending' && (
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => openApprovalModal(warning)}
                          className="btn-primary flex items-center gap-2 text-sm py-1.5"
                        >
                          <FileCheck className="w-4 h-4" />
                          发起审批
                        </button>
                        <button
                          onClick={() => handleWarning(warning.id, 'handling')}
                          className="btn-warning flex items-center gap-2 text-sm py-1.5"
                        >
                          标记处理中
                        </button>
                        <button
                          onClick={() => handleWarning(warning.id, 'resolved')}
                          className="btn-secondary flex items-center gap-2 text-sm py-1.5"
                        >
                          标记已解决
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showApprovalModal && selectedWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-panel-bg border border-panel-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-panel-border">
              <h3 className="text-lg font-semibold text-text-primary">发起审批申请</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 rounded-lg hover:bg-panel-border/50 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-deep-space/50 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">关联预警</p>
                <p className="text-text-primary">{selectedWarning.description}</p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  申请类型
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setApprovalType('route_adjustment')}
                    className={`p-4 rounded-lg border transition-all ${
                      approvalType === 'route_adjustment'
                        ? 'border-tech-cyan bg-tech-cyan/10 text-tech-cyan'
                        : 'border-panel-border text-text-secondary hover:border-text-muted'
                    }`}
                  >
                    <Plane className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">航线调整</p>
                  </button>
                  <button
                    onClick={() => setApprovalType('grounding')}
                    className={`p-4 rounded-lg border transition-all ${
                      approvalType === 'grounding'
                        ? 'border-tech-cyan bg-tech-cyan/10 text-tech-cyan'
                        : 'border-panel-border text-text-secondary hover:border-text-muted'
                    }`}
                  >
                    <BatteryWarning className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">停飞检修</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  申请说明
                </label>
                <textarea
                  value={approvalDescription}
                  onChange={(e) => setApprovalDescription(e.target.value)}
                  placeholder="请详细说明调整原因和方案..."
                  className="input-field h-28 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-panel-border">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={submitApproval}
                disabled={!approvalDescription}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
