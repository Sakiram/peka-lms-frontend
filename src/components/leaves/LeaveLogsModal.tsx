import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Badge } from '@/components/ui/shadcn/badge';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import { History, CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import { leavesAPI, type LeaveLog } from '@/api/endpoints/leaves';
import { format } from 'date-fns';

interface LeaveLogsModalProps {
  leaveId: string | null;
  open: boolean;
  onClose: () => void;
}

export function LeaveLogsModal({ leaveId, open, onClose }: LeaveLogsModalProps) {
  const [logs, setLogs] = useState<LeaveLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && leaveId) {
      loadLogs();
    }
  }, [open, leaveId]);

  const loadLogs = async () => {
    if (!leaveId) return;
    
    try {
      setLoading(true);
      const response = await leavesAPI.getLeaveLogs(leaveId);
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATED':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATED':
        return 'default';
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Leave Activity Log
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getActionColor(log.action) as any}>
                        {log.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.when), 'MMM dd, yyyy hh:mm a')}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-medium">{log.by}</p>
                      <p className="text-sm text-muted-foreground">{log.role}</p>
                    </div>
                    
                    {log.remarks && (
                      <p className="text-sm bg-muted p-2 rounded">
                        {log.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity logs found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}