import type { LucideIcon } from 'lucide-react';

export type StatusTone = 'blue' | 'green' | 'amber' | 'red' | 'grey';

interface StatusIconProps {
  icon: LucideIcon;
  tone?: StatusTone;
  size?: 'sm' | 'md';
  label: string;
}

export function StatusIcon({ icon: Icon, tone = 'grey', size = 'sm', label }: StatusIconProps) {
  return (
    <span className={`ryops-status-icon is-${tone} is-${size}`} role="img" aria-label={label}>
      <Icon aria-hidden="true" />
    </span>
  );
}
