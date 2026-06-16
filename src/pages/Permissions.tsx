import { useState } from 'react';
import {
  Shield,
  User,
  Building2,
  Plane,
  Search,
  ChevronDown,
  Check,
  X,
  Globe2,
  MapPin,
  Building,
  ArrowLeftRight,
} from 'lucide-react';
import { enterprises } from '../data/mockData';
import { useAppStore } from '../store';
import type { User as UserType } from '../types';

const roles = [
  {
    id: 'national_admin',
    name: '国家级管理员',
    level: 'national',
    icon: Globe2,
    description: '民航局无人机处，查看全国数据、终审航线调整',
    permissions: ['全部查看', '终审审批', '系统配置', '用户管理'],
  },
  {
    id: 'provincial_admin',
    name: '省级管理员',
    level: 'provincial',
    icon: MapPin,
    description: '各省份空域管理办公室，查看所辖省数据',
    permissions: ['本省数据查看', '复核审批', '本省报表'],
  },
  {
    id: 'enterprise_admin',
    name: '运营企业管理员',
    level: 'enterprise',
    icon: Building,
    description: '各运营企业管理人员，查看本企业数据',
    permissions: ['本企业数据查看', '预警处理', '航线计划上传'],
  },
  {
    id: 'regional_dispatcher',
    name: '区域调度员',
    level: 'regional',
    icon: User,
    description: '区域调度员，接收预警、发起航线调整申请',
    permissions: ['片区数据查看', '发起审批申请', '预警处置'],
  },
];

const levelLabels: Record<string, string> = {
  national: '国家级',
  provincial: '省级',
  enterprise: '企业级',
  regional: '区域级',
};

const users = [
  { id: 1, name: '张建国', role: '国家级管理员', level: 'national', province: '全国', enterprise: '-', enterpriseId: undefined as string | undefined, status: 'active' },
  { id: 2, name: '李明华', role: '省级管理员', level: 'provincial', province: '广东', enterprise: '-', enterpriseId: undefined as string | undefined, status: 'active' },
  { id: 3, name: '王志强', role: '省级管理员', level: 'provincial', province: '上海', enterprise: '-', enterpriseId: undefined as string | undefined, status: 'active' },
  { id: 4, name: '赵晓燕', role: '运营企业管理员', level: 'enterprise', province: '北京', enterprise: '京东天鸿', enterpriseId: 'ENT002', status: 'active' },
  { id: 5, name: '陈立新', role: '运营企业管理员', level: 'enterprise', province: '浙江', enterprise: '菜鸟ET物流', enterpriseId: 'ENT004', status: 'inactive' },
  { id: 6, name: '刘伟', role: '区域调度员', level: 'regional', province: '四川', enterprise: '邮政EMS无人机', enterpriseId: 'ENT005', status: 'active' },
  { id: 7, name: '周美玲', role: '区域调度员', level: 'regional', province: '广东', enterprise: '顺丰无人机物流', enterpriseId: 'ENT001', status: 'active' },
];

export default function Permissions() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'enterprises'>('roles');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = useAppStore((state) => state.user);
  const switchRole = useAppStore((state) => state.switchRole);

  const isOriginalNational = currentUser.role === 'national_admin';

  const filteredUsers = users.filter((u) =>
    u.name.includes(searchQuery) || u.enterprise.includes(searchQuery)
  );

  const handleSwitchRole = (roleId: string) => {
    const role = roleId as UserType['role'];
    const roleLevel = roles.find((r) => r.id === roleId)?.level;
    const matchUser = users.find((u) => u.level === roleLevel);
    switchRole(role, matchUser?.province === '全国' ? undefined : matchUser?.province, matchUser?.enterpriseId);
  };

  const handleBackToNational = () => {
    switchRole('national_admin');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">权限管理</h1>
          <p className="text-text-muted text-sm mt-1">
            国家、省、运营企业三级权限管理，数据隔离
          </p>
        </div>
        {!isOriginalNational && (
          <div className="flex items-center gap-3">
            <span className="badge-info">
              当前角色: {levelLabels[currentUser.level] || currentUser.level}
            </span>
            <button onClick={handleBackToNational} className="btn-secondary flex items-center gap-2 text-sm">
              <ArrowLeftRight className="w-4 h-4" />
              返回国家级
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 bg-panel-bg rounded-xl w-fit border border-panel-border">
        {[
          { id: 'roles', label: '角色配置', icon: Shield },
          { id: 'users', label: '用户列表', icon: User },
          { id: 'enterprises', label: '企业管理', icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-tech-cyan text-deep-space'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const levelColors = {
              national: 'from-alert-red/20 to-alert-red/5 border-alert-red/30',
              provincial: 'from-tech-cyan/20 to-tech-cyan/5 border-tech-cyan/30',
              enterprise: 'from-alert-amber/20 to-alert-amber/5 border-alert-amber/30',
              regional: 'from-alert-green/20 to-alert-green/5 border-alert-green/30',
            };
            const textColors = {
              national: 'text-alert-red',
              provincial: 'text-tech-cyan',
              enterprise: 'text-alert-amber',
              regional: 'text-alert-green',
            };
            const isCurrentRole = currentUser.role === role.id;
            return (
              <div
                key={role.id}
                className={`panel bg-gradient-to-br ${levelColors[role.level as keyof typeof levelColors]} ${isCurrentRole ? 'ring-2 ring-tech-cyan' : ''}`}
              >
                <div className="panel-body">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${textColors[role.level as keyof typeof textColors]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">{role.name}</h3>
                      <p className="text-sm text-text-secondary mt-1">{role.description}</p>
                    </div>
                    {isCurrentRole && (
                      <span className="badge-info">当前</span>
                    )}
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-sm text-text-secondary mb-3">拥有权限</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-sm text-text-primary"
                        >
                          <Check className="w-3.5 h-3.5 text-alert-green" />
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!isCurrentRole && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleSwitchRole(role.id)}
                        className="btn-primary flex items-center gap-2 text-sm py-1.5"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        切换到该角色
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="搜索用户名、企业..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 h-10"
            />
          </div>

          <div className="panel overflow-hidden">
            <table className="w-full">
              <thead className="bg-deep-space/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    管辖范围
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    所属企业
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-deep-space/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-panel-border flex items-center justify-center">
                          <User className="w-4 h-4 text-text-secondary" />
                        </div>
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`badge-info ${
                          user.level === 'national'
                            ? '!bg-alert-red/20 !text-alert-red !border-alert-red/30'
                            : user.level === 'provincial'
                            ? ''
                            : user.level === 'enterprise'
                            ? '!bg-alert-amber/20 !text-alert-amber !border-alert-amber/30'
                            : '!bg-alert-green/20 !text-alert-green !border-alert-green/30'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-secondary">{user.province}</td>
                    <td className="px-5 py-4 text-text-secondary">{user.enterprise}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.status === 'active' ? 'bg-alert-green' : 'bg-text-muted'
                          }`}
                        />
                        <span
                          className={user.status === 'active' ? 'text-alert-green' : 'text-text-muted'}
                        >
                          {user.status === 'active' ? '启用' : '停用'}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-tech-cyan hover:text-tech-cyan-light text-sm font-medium">
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'enterprises' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enterprises.map((ent) => (
            <div key={ent.id} className="panel">
              <div className="panel-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-tech-cyan/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-tech-cyan" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{ent.name}</h4>
                      <p className="text-sm text-text-secondary mt-0.5">{ent.id}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                </div>
                <div className="mt-4 pt-4 border-t border-panel-border grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted">覆盖区域</p>
                    <p className="text-sm text-text-primary mt-1">{ent.province}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">无人机数量</p>
                    <p className="text-sm text-text-primary mt-1 font-mono">{ent.droneCount} 架</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
