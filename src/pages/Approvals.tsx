import { useState } from 'react';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  Plane,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '../store';
import type { Approval } from '../types';

const statusConfig = {
  pending_captain: { label: '待机长确认', step: 1, color: 'text-alert-amber' },
  pending_office: { label: '待空域办复核', step: 2, color: 'text-tech-cyan' },
  pending_caac: { label: '待民航局批准', step: 3, color: 'text-tech-cyan' },
  approved: { label: '已批准', step: 4, color: 'text-alert-green' },
  rejected: { label: '已驳回', step: 4, color: 'text-alert-red' },
};

const typeConfig = {
  route_adjustment: { label: '航线调整', icon: Plane },
  grounding: { label: '停飞检修', icon: FileCheck },
};

export default function Approvals() {
  const approvals = useAppStore((state) => state.approvals);
  const updateApproval = useAppStore((state) => state.updateApproval);
  const user = useAppStore((state) => state.user);

  const [filter, setFilter] = useState<Approval['status'] | 'all'>('all');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [note, setNote] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const getCurrentStep = (status: Approval['status']) => statusConfig[status].step;

  const canApprove = (approval: Approval) => {
    if (user.role === 'regional_dispatcher') return approval.status === 'pending_captain';
    if (user.role === 'provincial_admin') return approval.status === 'pending_office';
    if (user.role === 'national_admin') return approval.status === 'pending_caac';
    return false;
  };

  const handleApprove = () => {
    if (!selectedApproval) return;
    const updates: Partial<Approval> = {};
    const now = new Date();

    if (selectedApproval.status === 'pending_captain') {
      updates.status = 'pending_office';
      updates.captainNote = note || '确认无误，同意提交';
      updates.captainApprovedAt = now;
    } else if (selectedApproval.status === 'pending_office') {
      updates.status = 'pending_caac';
      updates.officeNote = note || '空域复核通过';
      updates.officeApprovedAt = now;
    } else if (selectedApproval.status === 'pending_caac') {
      updates.status = 'approved';
      updates.caacNote = note || '批准执行';
      updates.caacApprovedAt = now;
    }

    updateApproval(selectedApproval.id, updates);
    setSelectedApproval(null);
    setNote('');
  };

  const handleReject = () => {
    if (!selectedApproval) return;
    updateApproval(selectedApproval.id, {
      status: 'rejected',
      caacNote: note || '申请被驳回',
    });
    setSelectedApproval(null);
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">审批中心</h1>
        <p className="text-text-muted text-sm mt-1">
          三级审批流程：机长确认 → 空域管理办公室复核 → 民航局无人机处批准
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(['pending_captain', 'pending_office', 'pending_caac', 'approved', 'rejected'] as const).map(
          (status) => (
            <div key={status} className="data-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-mono text-text-primary">
                    {approvals.filter((a) => a.status === status).length}
                  </p>
                  <p className={`text-xs mt-1 ${statusConfig[status].color}`}>
                    {statusConfig[status].label}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${statusConfig[status].color.replace('text-', 'bg-')}/10`}>
                  <FileCheck className={`w-5 h-5 ${statusConfig[status].color}`} />
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Approval['status'] | 'all')}
          className="input-field w-44 h-9 text-sm"
        >
          <option value="all">全部状态</option>
          <option value="pending_captain">待机长确认</option>
          <option value="pending_office">待空域办复核</option>
          <option value="pending_caac">待民航局批准</option>
          <option value="approved">已批准</option>
          <option value="rejected">已驳回</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredApprovals.map((approval) => {
          const TypeIcon = typeConfig[approval.type].icon;
          const currentStep = getCurrentStep(approval.status);
          return (
            <div key={approval.id} className="panel overflow-hidden">
              <div className="panel-header">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-tech-cyan/10">
                    <TypeIcon className="w-5 h-5 text-tech-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary">
                        {approval.description}
                      </h3>
                      <span className="badge-info">{typeConfig[approval.type].label}</span>
                      <span
                        className={`flex items-center gap-1 text-sm ${statusConfig[approval.status].color}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {statusConfig[approval.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      申请ID: {approval.id} · 申请人: {approval.requestedBy} · 省份: {approval.province}
                    </p>
                  </div>
                </div>
                {canApprove(approval) && (
                  <button
                    onClick={() => setSelectedApproval(approval)}
                    className="btn-primary"
                  >
                    处理审批
                  </button>
                )}
              </div>

              <div className="panel-body">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {[
                      { label: '机长确认', icon: User, step: 1 },
                      { label: '空域办复核', icon: Building2, step: 2 },
                      { label: '民航局批准', icon: Plane, step: 3 },
                      { label: '执行', icon: CheckCircle, step: 4 },
                    ].map((item, idx) => {
                      const completed = approval.status === 'approved'
                        ? true
                        : currentStep > item.step;
                      const active = currentStep === item.step && approval.status !== 'rejected';
                      return (
                        <div key={item.label} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                active
                                  ? 'bg-tech-cyan text-deep-space shadow-glow-cyan animate-pulse'
                                  : completed
                                  ? 'bg-alert-green text-white'
                                  : approval.status === 'rejected'
                                  ? 'bg-alert-red text-white'
                                  : 'bg-panel-border text-text-muted'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-xs mt-2 ${
                                active || completed ? 'text-text-primary' : 'text-text-muted'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {idx < 3 && (
                            <div
                              className={`flex-1 h-0.5 mx-2 ${
                                completed ? 'bg-alert-green' : 'bg-panel-border'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {(approval.captainNote || approval.officeNote || approval.caacNote) && (
                  <div className="mt-6 pt-6 border-t border-panel-border">
                    <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-text-secondary" />
                      审批意见
                    </h4>
                    <div className="space-y-2">
                      {approval.captainNote && (
                        <div className="flex items-start gap-3 p-3 bg-deep-space/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-alert-amber/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-alert-amber" />
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary">
                              机长 · {approval.captainApprovedAt?.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-primary mt-0.5">
                              {approval.captainNote}
                            </p>
                          </div>
                        </div>
                      )}
                      {approval.officeNote && (
                        <div className="flex items-start gap-3 p-3 bg-deep-space/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-tech-cyan/20 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-tech-cyan" />
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary">
                              空域管理办公室 · {approval.officeApprovedAt?.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-primary mt-0.5">
                              {approval.officeNote}
                            </p>
                          </div>
                        </div>
                      )}
                      {approval.caacNote && (
                        <div className="flex items-start gap-3 p-3 bg-deep-space/50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-alert-green/20 flex items-center justify-center flex-shrink-0">
                            <Plane className="w-4 h-4 text-alert-green" />
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary">
                              民航局无人机处 · {approval.caacApprovedAt?.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-primary mt-0.5">
                              {approval.caacNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedApproval && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-panel-bg border border-panel-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-panel-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {selectedApproval.status === 'pending_captain' && '机长确认'}
                {selectedApproval.status === 'pending_office' && '空域办复核'}
                {selectedApproval.status === 'pending_caac' && '民航局审批'}
              </h3>
              <button
                onClick={() => setSelectedApproval(null)}
                className="p-2 rounded-lg hover:bg-panel-border/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-text-secondary rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-deep-space/50 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">申请内容</p>
                <p className="text-text-primary">{selectedApproval.description}</p>
                <p className="text-xs text-text-muted mt-2">
                  申请人: {selectedApproval.requestedBy} · {selectedApproval.province}
                </p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  审批意见
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="请输入审批意见..."
                  className="input-field h-28 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-panel-border">
              <button onClick={handleReject} className="btn-danger">
                <span className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  驳回
                </span>
              </button>
              <button onClick={handleApprove} className="btn-primary">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  通过
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
