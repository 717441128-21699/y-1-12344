import { create } from 'zustand';
import type {
  Drone,
  FlightRoute,
  Warning,
  Approval,
  User,
  ProvinceData,
  DroneModelStats,
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

  setSelectedProvince: (province: string | null) => void;
  setSelectedDroneModel: (model: string | null) => void;
  setActiveWarningId: (id: string | null) => void;

  handleWarning: (warningId: string, status: Warning['status']) => void;
  createApproval: (approval: Omit<Approval, 'id' | 'createdAt'>) => void;
  updateApproval: (approvalId: string, updates: Partial<Approval>) => void;
}

export const useAppStore = create<AppState>((set) => ({
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
    set((state) => ({
      approvals: [
        {
          ...approval,
          id: `AP${String(state.approvals.length + 1).padStart(3, '0')}`,
          createdAt: new Date(),
        },
        ...state.approvals,
      ],
    })),

  updateApproval: (approvalId, updates) =>
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === approvalId ? { ...a, ...updates } : a
      ),
    })),
}));
