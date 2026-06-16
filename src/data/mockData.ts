import type {
  Drone,
  FlightRoute,
  Warning,
  Approval,
  User,
  Weather,
  ProvinceData,
  DroneModelStats,
  DeliveryTrend,
  BatteryDecay,
  WeatherImpact,
  WeeklyReport,
  RiskPrediction,
} from '../types';

const PROVINCES = [
  { name: '北京', code: 'BJ', center: [116.4, 39.9] },
  { name: '上海', code: 'SH', center: [121.47, 31.23] },
  { name: '广东', code: 'GD', center: [113.28, 23.12] },
  { name: '浙江', code: 'ZJ', center: [120.15, 30.28] },
  { name: '江苏', code: 'JS', center: [118.78, 32.04] },
  { name: '四川', code: 'SC', center: [104.06, 30.67] },
  { name: '湖北', code: 'HB', center: [114.3, 30.6] },
  { name: '山东', code: 'SD', center: [117.0, 36.65] },
  { name: '河南', code: 'HN', center: [113.62, 34.75] },
  { name: '陕西', code: 'SX', center: [108.95, 34.27] },
  { name: '福建', code: 'FJ', center: [119.3, 26.08] },
  { name: '湖南', code: 'HUN', center: [112.98, 28.19] },
];

const DRONE_MODELS = ['DJI Matrice 350', 'DJI FlyCart 30', 'EHang 216', 'XAG V40', 'Meituan M1'];

export const currentUser: User = {
  id: 'u001',
  name: '张建国',
  role: 'national_admin',
  level: 'national',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
};

export const drones: Drone[] = Array.from({ length: 50 }, (_, i) => {
  const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  const statuses: Drone['status'][] = ['flying', 'idle', 'charging', 'maintenance', 'warning'];
  return {
    id: `DR${String(i + 1).padStart(4, '0')}`,
    model: DRONE_MODELS[Math.floor(Math.random() * DRONE_MODELS.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    batteryHealth: 55 + Math.floor(Math.random() * 45),
    currentBattery: Math.floor(Math.random() * 100),
    location: {
      lat: province.center[1] + (Math.random() - 0.5) * 2,
      lng: province.center[0] + (Math.random() - 0.5) * 2,
      name: `${province.name}${['东', '西', '南', '北', '中'][Math.floor(Math.random() * 5)]}起降点`,
    },
    speed: Math.floor(Math.random() * 80),
    payload: Math.floor(Math.random() * 30),
    enterpriseId: `ENT${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
    province: province.name,
    altitude: Math.floor(Math.random() * 200),
  };
});

export const flightRoutes: FlightRoute[] = Array.from({ length: 30 }, (_, i) => {
  const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  const statuses: FlightRoute['status'][] = ['pending', 'in_progress', 'completed', 'delayed', 'cancelled'];
  const now = new Date();
  return {
    id: `RT${String(i + 1).padStart(4, '0')}`,
    routeName: `${province.name}-${String.fromCharCode(65 + (i % 26))}${i + 1}号线`,
    takeoffPoint: `${province.name}配送中心`,
    landingPoint: `${province.name}${['东', '西', '南', '北'][Math.floor(Math.random() * 4)]}站`,
    plannedTakeoff: new Date(now.getTime() + Math.random() * 86400000 * 3),
    plannedLanding: new Date(now.getTime() + Math.random() * 86400000 * 3 + 1800000),
    actualTakeoff: Math.random() > 0.3 ? new Date(now.getTime() - Math.random() * 86400000) : undefined,
    actualLanding: Math.random() > 0.5 ? new Date(now.getTime() - Math.random() * 86400000 + 1800000) : undefined,
    efficiency: 75 + Math.random() * 25,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    province: province.name,
    droneId: `DR${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`,
    packageWeight: 5 + Math.random() * 25,
    energyConsumption: 2 + Math.random() * 8,
    conflictEvents: Math.floor(Math.random() * 3),
  };
});

export const warnings: Warning[] = [
  {
    id: 'W001',
    type: 'timeout',
    level: 'danger',
    description: '航线 SH-A03 连续2次配送超时，平均延误23分钟',
    droneId: 'DR0012',
    routeId: 'RT0008',
    createdAt: new Date(Date.now() - 1800000),
    status: 'pending',
    province: '上海',
    consecutiveCount: 2,
  },
  {
    id: 'W002',
    type: 'battery',
    level: 'warning',
    description: '无人机 DR0028 电池健康度降至62%，建议检修',
    droneId: 'DR0028',
    createdAt: new Date(Date.now() - 3600000),
    status: 'handling',
    province: '广东',
  },
  {
    id: 'W003',
    type: 'timeout',
    level: 'critical',
    description: '航线 GD-B07 连续3次配送超时，平均延误45分钟',
    droneId: 'DR0035',
    routeId: 'RT0015',
    createdAt: new Date(Date.now() - 7200000),
    status: 'pending',
    province: '广东',
    consecutiveCount: 3,
  },
  {
    id: 'W004',
    type: 'battery',
    level: 'danger',
    description: '无人机 DR0042 电池健康度58%，需立即停飞检修',
    droneId: 'DR0042',
    createdAt: new Date(Date.now() - 900000),
    status: 'pending',
    province: '浙江',
  },
  {
    id: 'W005',
    type: 'weather',
    level: 'warning',
    description: '四川地区即将迎来强降雨天气，建议调整下午航线',
    createdAt: new Date(Date.now() - 600000),
    status: 'handling',
    province: '四川',
  },
  {
    id: 'W006',
    type: 'airspace',
    level: 'warning',
    description: '北京东部空域检测到异常飞行物，保持警惕',
    createdAt: new Date(Date.now() - 1200000),
    status: 'resolved',
    province: '北京',
  },
];

export const approvals: Approval[] = [
  {
    id: 'AP001',
    warningId: 'W001',
    type: 'route_adjustment',
    status: 'pending_captain',
    createdAt: new Date(Date.now() - 1200000),
    requestedBy: '李明',
    description: '申请调整上海 SH-A03 航线，绕开浦东新区新禁飞区',
    province: '上海',
  },
  {
    id: 'AP002',
    warningId: 'W003',
    type: 'grounding',
    status: 'pending_office',
    captainNote: '确认设备状态异常，建议停飞检修',
    captainApprovedAt: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 3600000),
    requestedBy: '王芳',
    description: '申请停飞无人机 DR0035，更换电池组',
    province: '广东',
  },
  {
    id: 'AP003',
    warningId: 'W002',
    type: 'route_adjustment',
    status: 'pending_caac',
    captainNote: '同意调整，已确认替代航线安全性',
    officeNote: '空域复核通过，不影响其他航班',
    captainApprovedAt: new Date(Date.now() - 7200000),
    officeApprovedAt: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 10800000),
    requestedBy: '陈伟',
    description: '申请调整广东 GD-C12 航线，优化飞行高度',
    province: '广东',
  },
];

export const weatherData: Weather[] = PROVINCES.map((p, i) => {
  const conditions: Weather['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'];
  return {
    id: `WEA${i + 1}`,
    province: p.name,
    timestamp: new Date(),
    temperature: 15 + Math.random() * 20,
    windSpeed: Math.random() * 25,
    visibility: 1 + Math.random() * 9,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
  };
});

export const provinceData: ProvinceData[] = PROVINCES.map((p) => ({
  name: p.name,
  code: p.code,
  onTimeRate: 78 + Math.random() * 20,
  avgDelay: Math.random() * 30,
  totalDeliveries: Math.floor(500 + Math.random() * 4500),
  failureRate: Math.random() * 5,
  center: p.center as [number, number],
}));

export const droneModelStats: DroneModelStats[] = DRONE_MODELS.map((model) => ({
  model,
  totalCount: Math.floor(5 + Math.random() * 20),
  failureRate: Math.random() * 6,
  avgBatteryHealth: 70 + Math.random() * 28,
  avgEfficiency: 75 + Math.random() * 22,
}));

const last7Days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toISOString().split('T')[0];
});

export const deliveryTrends: DeliveryTrend[] = last7Days.map((date) => {
  const total = 300 + Math.floor(Math.random() * 500);
  const delayed = Math.floor(total * (0.05 + Math.random() * 0.15));
  return {
    date,
    total,
    onTime: total - delayed,
    delayed,
  };
});

export const batteryDecayData: BatteryDecay[] = [
  { healthRange: '90-100%', count: 12 },
  { healthRange: '80-90%', count: 18 },
  { healthRange: '70-80%', count: 11 },
  { healthRange: '60-70%', count: 6 },
  { healthRange: '50-60%', count: 3 },
  { healthRange: '<50%', count: 1 },
];

export const weatherImpactData: WeatherImpact[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  condition: ['晴', '多云', '小雨', '雾'][Math.floor(Math.random() * 4)],
  impact: Math.random() * 100,
  deliveries: Math.floor(10 + Math.random() * 40),
}));

export const weeklyReport: WeeklyReport = {
  week: '2026年第24周 (6月9日-6月15日)',
  deliveryStats: {
    total: 18452,
    onTimeRate: 91.2,
    avgDelay: 8.5,
    weekOverWeek: 5.3,
    yearOverYear: 18.7,
  },
  energyRanking: [
    { model: 'DJI Matrice 350', kwhPerKm: 0.12 },
    { model: 'Meituan M1', kwhPerKm: 0.15 },
    { model: 'DJI FlyCart 30', kwhPerKm: 0.18 },
    { model: 'XAG V40', kwhPerKm: 0.21 },
    { model: 'EHang 216', kwhPerKm: 0.28 },
  ],
  complaintDistribution: [
    { type: '配送延迟', count: 89 },
    { type: '包裹损坏', count: 23 },
    { type: '服务态度', count: 12 },
    { type: '地址错误', count: 18 },
    { type: '其他', count: 7 },
  ],
  optimizationRecommendations: [
    '建议优化广东地区 GD-B07 航线，该航线本周连续超时率达42%',
    '无人机 DR0042、DR0028 电池衰减严重，建议列入下批维护计划',
    '浙江地区早高峰(8:00-10:00)配送效率较低，建议增加起降点备勤',
    'DJI FlyCart 30 机型能耗偏高，建议评估替代方案',
  ],
};

export const riskPredictions: RiskPrediction[] = Array.from({ length: 48 }, (_, i) => {
  const now = new Date();
  now.setHours(now.getHours() + i);
  const hour = now.getHours();
  let riskLevel: RiskPrediction['riskLevel'] = 'low';
  let weatherCondition = '晴';
  let windSpeed = 5 + Math.random() * 10;
  let visibility = 8 + Math.random() * 2;

  if ((hour >= 14 && hour <= 16) || (hour >= 22 && hour <= 23)) {
    riskLevel = i % 3 === 0 ? 'high' : 'medium';
    weatherCondition = i % 3 === 0 ? '雷阵雨' : '多云有雨';
    windSpeed = 15 + Math.random() * 15;
    visibility = 2 + Math.random() * 3;
  }

  return {
    time: `${String(hour).padStart(2, '0')}:00`,
    riskLevel,
    weatherCondition,
    windSpeed: Math.round(windSpeed * 10) / 10,
    visibility: Math.round(visibility * 10) / 10,
    recommendation: riskLevel === 'high' ? '建议延迟起飞或绕飞' : riskLevel === 'medium' ? '谨慎飞行，注意监控' : undefined,
  };
});

export const enterprises = [
  { id: 'ENT001', name: '顺丰无人机物流', province: '全国', droneCount: 45 },
  { id: 'ENT002', name: '京东天鸿', province: '北京', droneCount: 32 },
  { id: 'ENT003', name: '美团无人机', province: '上海', droneCount: 28 },
  { id: 'ENT004', name: '菜鸟ET物流', province: '浙江', droneCount: 25 },
  { id: 'ENT005', name: '邮政EMS无人机', province: '四川', droneCount: 18 },
];
