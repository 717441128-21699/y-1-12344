import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  FileCheck,
  Route,
  FileBarChart,
  Shield,
  Plane,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: '核心看板', icon: LayoutDashboard },
  { path: '/monitoring', label: '实时监测', icon: Radio },
  { path: '/alerts', label: '预警中心', icon: AlertTriangle },
  { path: '/approvals', label: '审批中心', icon: FileCheck },
  { path: '/routes', label: '航线管理', icon: Route },
  { path: '/reports', label: '运营报告', icon: FileBarChart },
  { path: '/permissions', label: '权限管理', icon: Shield },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-deep-space border-r border-panel-border flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-panel-border">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tech-cyan to-tech-cyan-dark flex items-center justify-center">
          <Plane className="w-6 h-6 text-deep-space" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text-primary">SkyLogistics</h1>
          <p className="text-xs text-text-muted">无人机监测平台</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-panel-border">
        <div className="bg-panel-bg rounded-lg p-3">
          <p className="text-xs text-text-muted mb-2">系统状态</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-alert-green animate-pulse" />
            <span className="text-sm text-text-primary">数据实时接入中</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            延迟: {Math.floor(Math.random() * 50 + 10)}ms
          </p>
        </div>
      </div>
    </aside>
  );
}
