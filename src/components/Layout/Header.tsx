import { Bell, Search, ChevronDown, Settings, ArrowLeftRight } from 'lucide-react';
import { useAppStore } from '../../store';

const levelLabels: Record<string, string> = {
  national: '国家级管理员',
  provincial: '省级管理员',
  enterprise: '企业管理员',
  regional: '区域调度员',
};

export default function Header() {
  const user = useAppStore((state) => state.user);
  const warnings = useAppStore((state) => state.warnings);
  const switchRole = useAppStore((state) => state.switchRole);
  const pendingWarnings = warnings.filter((w) => w.status === 'pending').length;
  const isNational = user.role === 'national_admin';

  return (
    <header className="h-16 bg-deep-space/80 backdrop-blur-sm border-b border-panel-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary">
          全国无人机物流配送运营监测中心
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索无人机、航线、起降点..."
            className="input-field w-80 pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-panel-border/50 transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          {pendingWarnings > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-alert-red rounded-full text-xs text-white flex items-center justify-center font-medium">
              {pendingWarnings}
            </span>
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-panel-border/50 transition-colors">
          <Settings className="w-5 h-5 text-text-secondary" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-panel-border">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full bg-panel-border"
          />
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted">
              {levelLabels[user.level] || user.level}
            </p>
          </div>
          {!isNational && (
            <button
              onClick={() => switchRole('national_admin')}
              className="ml-2 p-1.5 rounded-lg hover:bg-tech-cyan/10 transition-colors"
              title="切换回国家级管理员"
            >
              <ArrowLeftRight className="w-4 h-4 text-tech-cyan" />
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
      </div>
    </header>
  );
}
