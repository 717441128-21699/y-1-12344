import { useAppStore } from '../../store';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function FailureRanking() {
  const modelStats = useAppStore((state) => state.droneModelStats);
  const sortedStats = [...modelStats].sort((a, b) => b.failureRate - a.failureRate);

  return (
    <div className="space-y-3">
      {sortedStats.map((stat, index) => (
        <div
          key={stat.model}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-deep-space/50 transition-colors"
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0
                ? 'bg-alert-red/20 text-alert-red'
                : index === 1
                ? 'bg-alert-amber/20 text-alert-amber'
                : index === 2
                ? 'bg-tech-cyan/20 text-tech-cyan'
                : 'bg-panel-border text-text-secondary'
            }`}
          >
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-text-primary truncate">
                {stat.model}
              </span>
              <span className="text-sm font-mono text-text-primary">
                {stat.failureRate.toFixed(2)}%
              </span>
            </div>
            <div className="h-1.5 bg-deep-space rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  stat.failureRate > 4
                    ? 'bg-gradient-to-r from-alert-red to-alert-amber'
                    : stat.failureRate > 2
                    ? 'bg-gradient-to-r from-alert-amber to-tech-cyan'
                    : 'bg-gradient-to-r from-tech-cyan to-alert-green'
                }`}
                style={{ width: `${Math.min(stat.failureRate * 15, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {stat.avgBatteryHealth < 80 ? (
              <TrendingDown className="w-3 h-3 text-alert-red" />
            ) : (
              <TrendingUp className="w-3 h-3 text-alert-green" />
            )}
            <span
              className={stat.avgBatteryHealth < 80 ? 'text-alert-red' : 'text-alert-green'}
            >
              {stat.avgBatteryHealth.toFixed(0)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
