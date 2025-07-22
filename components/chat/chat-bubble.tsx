import { format } from 'date-fns';
import { CheckCheck, Check, FileText, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'; // Renamed Image and Video to avoid conflict
import { cn } from '@/lib/utils'; // Assuming cn is a utility for class names

// --- UPDATED Message INTERFACE ---
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'image' | 'video' | 'file'; // Add message type
  text?: string; // Make text optional
  fileUrl?: string; // Add file URL
  fileName?: string; // Add file name
  fileSize?: number; // Add file size
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatBubbleProps {
  message: Message; // Now accepts the full message object
  isMe: boolean;
  // Removed individual props like 'text', 'timestamp', 'status' as they are now part of 'message'
}

export default function ChatBubble({ message, isMe }: ChatBubbleProps) {
  const statusIcon = message.status === 'read' ? (
    <CheckCheck className="h-3 w-3 text-blue-500" />
  ) : message.status === 'delivered' ? (
    <CheckCheck className="h-3 w-3 text-gray-500 dark:text-gray-400" />
  ) : (
    <Check className="h-3 w-3 text-gray-500 dark:text-gray-400" />
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn(
      "flex items-end gap-2",
      isMe ? "justify-end" : "justify-start"
    )}>
      {isMe ? (
        <div className="max-w-[75%] flex flex-col items-end">
          <div
            className={cn(
              "p-3 rounded-lg",
              message.type === 'text' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-primary/90 text-primary-foreground",
              // Adjust padding/styling for media messages if needed
              (message.type === 'image' || message.type === 'video') && "p-1.5", // Smaller padding for media
              message.type === 'file' && "p-2" // Smaller padding for file
            )}
          >
            {/* Render based on message type */}
            {message.type === 'text' && (
              <p className="text-sm break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}

            {message.type === 'image' && message.fileUrl && (
              <>
                {/* For images, it's often better to open in a new tab for preview */}
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "Image"}
                  className="max-w-full h-auto rounded-md cursor-pointer object-cover"
                  style={{ maxHeight: '300px' }} // Limit image height
                  onClick={() => window.open(message.fileUrl, '_blank')} // Open image in new tab
                />
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </>
            )}

            {message.type === 'video' && message.fileUrl && (
              <>
                {/* For videos, controls are usually sufficient within the chat */}
                <video
                  controls
                  src={message.fileUrl}
                  className="max-w-full h-auto rounded-md"
                  style={{ maxHeight: '300px' }} // Limit video height
                >
                  Your browser does not support the video tag.
                </video>
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </>
            )}

            {message.type === 'file' && message.fileUrl && (
              <div className="flex flex-col gap-1">
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={message.fileName || 'download'} // --- KEY CHANGE HERE ---
                  className="flex items-center gap-2 p-2 bg-background/50 dark:bg-gray-700/50 rounded-md hover:bg-background/70 dark:hover:bg-gray-700/70 transition-colors"
                >
                  <FileText className="h-5 w-5 flex-shrink-0 text-white" />
                  <span className="text-white text-sm truncate max-w-[calc(100%-40px)]">
                    {message.fileName || "File"}
                  </span>
                  {message.fileSize && (
                    <span className="text-xs text-white/70 ml-auto flex-shrink-0">
                      ({formatFileSize(message.fileSize)})
                    </span>
                  )}
                </a>
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            {format(new Date(message.timestamp), 'h:mm a')}
            <span className="ml-1">
              {statusIcon}
            </span>
          </div>
        </div>
      ) : (
        <div className="max-w-[75%] flex flex-col">
          <div
            className={cn(
              "p-3 rounded-lg",
              message.type === 'text' ? "bg-blue-200 dark:bg-gray-800 rounded-tl-none" : "bg-gray-200 dark:bg-gray-800",
              // Adjust padding/styling for media messages if needed
              (message.type === 'image' || message.type === 'video') && "p-1.5",
              message.type === 'file' && "p-2"
            )}
          >
            {/* Render based on message type */}
            {message.type === 'text' && (
              <p className="text-sm break-words whitespace-pre-wrap">
                {message.text}
              </p>
            )}

            {message.type === 'image' && message.fileUrl && (
              <>
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "Image"}
                  className="max-w-full h-auto rounded-md cursor-pointer object-cover"
                  style={{ maxHeight: '300px' }}
                  onClick={() => window.open(message.fileUrl, '_blank')}
                />
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </>
            )}

            {message.type === 'video' && message.fileUrl && (
              <>
                <video
                  controls
                  src={message.fileUrl}
                  className="max-w-full h-auto rounded-md"
                  style={{ maxHeight: '300px' }}
                >
                  Your browser does not support the video tag.
                </video>
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </>
            )}

            {message.type === 'file' && message.fileUrl && (
              <div className="flex flex-col gap-1">
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={message.fileName || 'download'} // --- KEY CHANGE HERE ---
                  className="flex items-center gap-2 p-2 bg-background dark:bg-gray-700 rounded-md hover:bg-background/80 dark:hover:bg-gray-700/80 transition-colors"
                >
                  <FileText className="h-5 w-5 flex-shrink-0 text-foreground" />
                  <span className="text-foreground text-sm truncate max-w-[calc(100%-40px)]">
                    {message.fileName || "File"}
                  </span>
                  {message.fileSize && (
                    <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                      ({formatFileSize(message.fileSize)})
                    </span>
                  )}
                </a>
                {message.text && (
                  <p className="text-xs mt-1 px-1 opacity-90 break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </div>
            )}
          </div>
          <span className="mt-1 text-xs text-muted-foreground">
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
        </div>
      )}
    </div>
  );
}