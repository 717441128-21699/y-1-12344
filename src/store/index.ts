import { create } from 'zustand';
import type {
  Drone,
  FlightRoute,
  Warning,
  Approval,
  User,
  ProvinceData,
  DroneModelStats,
  UploadedRoutePlan,
  UploadedAirspaceDoc,
} from '../types';
import {
  drones as mockDrones,
  flightRoutes as mockRoutes,
  warnings as mockWarnings,
  approvals as mockApprovals,
  currentUser as mockUser,
  provinceData as mockProvinceData,
  droneModelStats as mockModelStats,
} from '../data/mockData';

interface AppState {
  user: User;
  drones: Drone[];
  flightRoutes: FlightRoute[];
  warnings: Warning[];
  approvals: Approval[];
  provinceData: ProvinceData[];
  droneModelStats: DroneModelStats[];
  selectedProvince: string | null;
  selectedDroneModel: string | null;
  activeWarningId: string | null;
  uploadedRoutePlan: UploadedRoutePlan | null;
  uploadedAirspaceDoc: UploadedAirspaceDoc | null;

  setSelectedProvince: (province: string | null) => void;
  setSelectedDroneModel: (model: string | null) => void;
  setActiveWarningId: (id: string | null) => void;

  handleWarning: (warningId: string, status: Warning['status']) => void;
  createApproval: (approval: Omit<Approval, 'id' | 'createdAt'>) => void;
  updateApproval: (approvalId: string, updates: Partial<Approval>) => void;

  getFilteredDrones: () => Drone[];
  getFilteredRoutes: () => FlightRoute[];
  getFilteredWarnings: () => Warning[];
  getFilteredApprovals: () => Approval[];
  getFilteredProvinceData: () => ProvinceData[];
  getFilteredModelStats: () => DroneModelStats[];

  switchRole: (role: User['role'], province?: string, enterpriseId?: string) => void;
  generateWarnings: () => void;

  setUploadedRoutePlan: (plan: UploadedRoutePlan | null) => void;
  setUploadedAirspaceDoc: (doc: UploadedAirspaceDoc | null) => void;
  clearUploads: () => void;
}

const filterByPermission = <T extends { province: string }>(items: T[], user: User): T[] => {
  if (user.level === 'national') return items;
  if (user.level === 'provincial') return items.filter((i) => i.province === user.province);
  if (user.level === 'enterprise') {
    if (user.enterpriseId) {
      return items.filter((i) => 'enterpriseId' in i && (i as any).enterpriseId === user.enterpriseId);
    }
    return items.filter((i) => i.province === user.province);
  }
  if (user.level === 'regional') return items.filter((i) => i.province === user.province);
  return items;
};

const filterByDroneModel = <T extends { droneId?: string }>(items: T[], selectedModel: string | null, drones: Drone[]): T[] => {
  if (!selectedModel) return items;
  const droneIdsForModel = new Set(drones.filter((d) => d.model === selectedModel).map((d) => d.id));
  return items.filter((i) => !i.droneId || droneIdsForModel.has(i.droneId));
};

export const useAppStore = create<AppState>((set, get) => ({
  user: mockUser,
  drones: mockDrones,
  flightRoutes: mockRoutes,
  warnings: mockWarnings,
  approvals: mockApprovals,
  provinceData: mockProvinceData,
  droneModelStats: mockModelStats,
  selectedProvince: null,
  selectedDroneModel: null,
  activeWarningId: null,
  uploadedRoutePlan: null,
  uploadedAirspaceDoc: null,

  setSelectedProvince: (province) => set({ selectedProvince: province }),
  setSelectedDroneModel: (model) => set({ selectedDroneModel: model }),
  setActiveWarningId: (id) => set({ activeWarningId: id }),

  handleWarning: (warningId, status) =>
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.id === warningId ? { ...w, status, handlerId: state.user.id } : w
      ),
    })),

  createApproval: (approval) =>
    set((state) => {
      const newApproval = {
        ...approval,
        id: `AP${String(state.approvals.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
      };
      const updatedWarnings = state.warnings.map((w) =>
        w.id === approval.warningId ? { ...w, status: 'handling' as const, handlerId: state.user.id } : w
      );
      return {
        approvals: [newApproval, ...state.approvals],
        warnings: updatedWarnings,
      };
    }),

  updateApproval: (approvalId, updates) =>
    set((state) => {
      const updatedApprovals = state.approvals.map((a) =>
        a.id === approvalId ? { ...a, ...updates } : a
      );
      const targetApproval = updatedApprovals.find((a) => a.id === approvalId);
      if (!targetApproval) return { approvals: updatedApprovals };

      let updatedWarnings = state.warnings;
      let updatedDrones = state.drones;

      if (updates.status === 'approved' && targetApproval.warningId) {
        updatedWarnings = state.warnings.map((w) =>
          w.id === targetApproval.warningId ? { ...w, status: 'resolved' as const } : w
        );
        if (targetApproval.type === 'grounding') {
          const warning = state.warnings.find((w) => w.id === targetApproval.warningId);
          if (warning?.droneId) {
            updatedDrones = state.drones.map((d) =>
              d.id === warning.droneId ? { ...d, status: 'maintenance' as const } : d
            );
          }
        }
      }

      return {
        approvals: updatedApprovals,
        warnings: updatedWarnings,
        drones: updatedDrones,
      };
    }),

  getFilteredDrones: () => {
    const { user, drones, selectedDroneModel } = get();
    let filtered = filterByPermission(drones, user);
    if (user.level === 'enterprise' || user.level === 'regional') {
      filtered = filtered.filter((d) => {
        if (user.level === 'enterprise' && user.enterpriseId) return d.enterpriseId === user.enterpriseId;
        return true;
      });
    }
    if (selectedDroneModel) {
      filtered = filtered.filter((d) => d.model === selectedDroneModel);
    }
    return filtered;
  },

  getFilteredRoutes: () => {
    const { user, flightRoutes, selectedDroneModel, drones } = get();
    let filtered = filterByPermission(flightRoutes, user);
    filtered = filterByDroneModel(filtered, selectedDroneModel, drones);
    return filtered;
  },

  getFilteredWarnings: () => {
    const { user, warnings, selectedDroneModel, drones } = get();
    let filtered = filterByPermission(warnings, user);
    filtered = filterByDroneModel(filtered, selectedDroneModel, drones);
    return filtered;
  },

  getFilteredApprovals: () => {
    const { user, approvals } = get();
    return filterByPermission(approvals, user);
  },

  getFilteredProvinceData: () => {
    const { user, provinceData, drones } = get();
    if (user.level === 'national') return provinceData;
    if (user.level === 'provincial' || user.level === 'regional') {
      return provinceData.filter((p) => p.name === user.province);
    }
    if (user.level === 'enterprise' && user.enterpriseId) {
      const enterpriseProvinces = new Set(drones.filter((d) => d.enterpriseId === user.enterpriseId).map((d) => d.province));
      return provinceData.filter((p) => enterpriseProvinces.has(p.name));
    }
    return provinceData;
  },

  getFilteredModelStats: () => {
    const { user, droneModelStats, drones } = get();
    if (user.level === 'enterprise' && user.enterpriseId) {
      const enterpriseModels = new Set(drones.filter((d) => d.enterpriseId === user.enterpriseId).map((d) => d.model));
      return droneModelStats.filter((s) => enterpriseModels.has(s.model));
    }
    return droneModelStats;
  },

  switchRole: (role, province, enterpriseId) =>
    set((state) => ({
      user: {
        ...state.user,
        role,
        level: role === 'national_admin' ? 'national' as const : role === 'provincial_admin' ? 'provincial' as const : role === 'enterprise_admin' ? 'enterprise' as const : 'regional' as const,
        province: province ?? (role === 'national_admin' ? undefined : state.user.province),
        enterpriseId: enterpriseId ?? (role === 'national_admin' || role === 'provincial_admin' ? undefined : state.user.enterpriseId),
      },
    })),

  generateWarnings: () =>
    set((state) => {
      const newWarnings: Warning[] = [];
      const existingDroneIds = new Set(state.warnings.filter((w) => w.type === 'battery').map((w) => w.droneId).filter(Boolean) as string[]);
      const existingRouteIds = new Set(state.warnings.filter((w) => w.type === 'timeout').map((w) => w.routeId).filter(Boolean) as string[] as string[]);

      state.drones.forEach((drone) => {
        if (drone.batteryHealth < 70 && !existingDroneIds.has(drone.id)) {
          newWarnings.push({
            id: `W${String(state.warnings.length + newWarnings.length + 1).padStart(3, '0')}`,
            type: 'battery',
            level: drone.batteryHealth < 60 ? 'danger' : 'warning',
            description: `无人机 ${drone.id} 电池健康度${drone.batteryHealth}%，${drone.batteryHealth < 60 ? '需立即停飞检修' : '建议检修'}`,
            droneId: drone.id,
            createdAt: new Date(),
            status: 'pending',
            province: drone.province,
          });
        }
      });

      const routeDelays: Record<string, FlightRoute[]> = {};
      state.flightRoutes.forEach((route) => {
        if (route.status === 'delayed') {
          if (!routeDelays[route.droneId]) routeDelays[route.droneId] = [];
          routeDelays[route.droneId].push(route);
        }
      });

      Object.entries(routeDelays).forEach(([droneId, routes]) => {
        if (routes.length >= 2) {
          const firstRoute = routes[0];
          if (!existingRouteIds.has(firstRoute.id)) {
            const avgDelay = Math.round(15 + Math.random() * 30);
            newWarnings.push({
              id: `W${String(state.warnings.length + newWarnings.length + 1).padStart(3, '0')}`,
              type: 'timeout',
              level: routes.length >= 3 ? 'critical' : 'danger',
              description: `无人机 ${droneId} 关联航线连续${routes.length}次配送超时，平均延误${avgDelay}分钟`,
              droneId,
              routeId: firstRoute.id,
              createdAt: new Date(),
              status: 'pending',
              province: firstRoute.province,
              consecutiveCount: routes.length,
            });
          }
        }
      });

      return { warnings: [...newWarnings, ...state.warnings] };
    }),

  setUploadedRoutePlan: (plan) => set({ uploadedRoutePlan: plan }),
  setUploadedAirspaceDoc: (doc) => set({ uploadedAirspaceDoc: doc }),
  clearUploads: () => set({ uploadedRoutePlan: null, uploadedAirspaceDoc: null }),
}));
