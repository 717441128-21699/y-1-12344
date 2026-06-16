import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  color?: 'cyan' | 'green' | 'amber' | 'red';
}

export default function StatCard({ label, value, icon: Icon, change, color = 'cyan' }: StatCardProps) {
  const colorClasses = {
    cyan: 'from-tech-cyan/20 to-tech-cyan/5 text-tech-cyan',
    green: 'from-alert-green/20 to-alert-green/5 text-alert-green',
    amber: 'from-alert-amber/20 to-alert-amber/5 text-alert-amber',
    red: 'from-alert-red/20 to-alert-red/5 text-alert-red',
  };

  return (
    <div className="data-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                'text-xs mt-2 flex items-center gap-1',
                change >= 0 ? 'text-alert-green' : 'text-alert-red'
              )}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% 较上周
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
