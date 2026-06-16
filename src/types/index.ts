export interface Drone {
  id: string;
  model: string;
  status: 'flying' | 'idle' | 'charging' | 'maintenance' | 'warning';
  batteryHealth: number;
  currentBattery: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  speed: number;
  payload: number;
  enterpriseId: string;
  province: string;
  altitude?: number;
}

export interface FlightRoute {
  id: string;
  routeName: string;
  takeoffPoint: string;
  landingPoint: string;
  plannedTakeoff: Date;
  plannedLanding: Date;
  actualTakeoff?: Date;
  actualLanding?: Date;
  efficiency: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  province: string;
  droneId: string;
  packageWeight: number;
  energyConsumption?: number;
  conflictEvents?: number;
}

export interface Warning {
  id: string;
  type: 'timeout' | 'battery' | 'airspace' | 'weather';
  level: 'warning' | 'danger' | 'critical';
  description: string;
  droneId?: string;
  routeId?: string;
  createdAt: Date;
  status: 'pending' | 'handling' | 'resolved';
  handlerId?: string;
  province: string;
  consecutiveCount?: number;
}

export interface Approval {
  id: string;
  warningId: string;
  type: 'route_adjustment' | 'grounding';
  status: 'pending_captain' | 'pending_office' | 'pending_caac' | 'approved' | 'rejected';
  captainNote?: string;
  officeNote?: string;
  caacNote?: string;
  captainApprovedAt?: Date;
  officeApprovedAt?: Date;
  caacApprovedAt?: Date;
  createdAt: Date;
  requestedBy: string;
  description: string;
  province: string;
}

export interface User {
  id: string;
  name: string;
  role: 'national_admin' | 'provincial_admin' | 'enterprise_admin' | 'regional_dispatcher';
  level: 'national' | 'provincial' | 'enterprise';
  province?: string;
  enterpriseId?: string;
  avatar?: string;
}

export interface Weather {
  id: string;
  province: string;
  timestamp: Date;
  temperature: number;
  windSpeed: number;
  visibility: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
}

export interface ProvinceData {
  name: string;
  code: string;
  onTimeRate: number;
  avgDelay: number;
  totalDeliveries: number;
  failureRate: number;
  center: [number, number];
}

export interface DroneModelStats {
  model: string;
  totalCount: number;
  failureRate: number;
  avgBatteryHealth: number;
  avgEfficiency: number;
}

export interface DeliveryTrend {
  date: string;
  total: number;
  onTime: number;
  delayed: number;
}

export interface BatteryDecay {
  healthRange: string;
  count: number;
}

export interface WeatherImpact {
  time: string;
  condition: string;
  impact: number;
  deliveries: number;
}

export interface WeeklyReport {
  week: string;
  deliveryStats: {
    total: number;
    onTimeRate: number;
    avgDelay: number;
    weekOverWeek: number;
    yearOverYear: number;
  };
  energyRanking: {
    model: string;
    kwhPerKm: number;
  }[];
  complaintDistribution: {
    type: string;
    count: number;
  }[];
  optimizationRecommendations: string[];
}

export interface RiskPrediction {
  time: string;
  riskLevel: 'low' | 'medium' | 'high';
  weatherCondition: string;
  windSpeed: number;
  visibility: number;
  recommendation?: string;
}

export interface RoutePlan {
  id: string;
  name: string;
  takeoffTime: Date;
  landingTime: Date;
  waypoints: { lat: number; lng: number }[];
  noFlyZones: string[];
  riskLevel: 'safe' | 'warning' | 'dangerous';
}
