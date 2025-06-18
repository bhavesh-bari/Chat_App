import { cn } from '@/lib/utils';

interface UserStatusDotProps {
  status: 'online' | 'offline' | 'away';
  className?: string;
}

export default function UserStatusDot({ status, className }: UserStatusDotProps) {
  return (
    <span 
      className={cn(
        'flex h-3 w-3 rounded-full border-2 border-white dark:border-gray-950',
        status === 'online' && 'bg-green-500',
        status === 'offline' && 'bg-gray-400',
        status === 'away' && 'bg-amber-500',
        className
      )}
    />
  );
}
