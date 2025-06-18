import { format } from 'date-fns';
import { CheckCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatBubble({ message, timestamp, isMe, status }: ChatBubbleProps) {
  return (
    <div className={cn(
      "flex items-end gap-2",
      isMe ? "justify-end" : "justify-start"
    )}>
      {isMe ? (
        <div className="max-w-[75%] flex flex-col items-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-br-none">
            {message}
          </div>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            {format(new Date(timestamp), 'h:mm a')}
            <span className="ml-1">
              {status === 'read' ? (
                <CheckCheck className="h-3 w-3" />
              ) : status === 'delivered' || status === 'sent' ? (
                <Check className="h-3 w-3" />
              ) : null}
            </span>
          </div>
        </div>
      ) : (
        <div className="max-w-[75%] flex flex-col">
          <div className="bg-blue-200 dark:bg-gray-800 p-3 rounded-lg rounded-tl-none">
            {message}
          </div>
          <span className="mt-1 text-xs text-muted-foreground">
            {format(new Date(timestamp), 'h:mm a')}
          </span>
        </div>
      )}
    </div>
  );
}