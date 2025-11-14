import type { LeaveType } from '@/types/leaves';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Edit2, Trash2, CheckCircle, XCircle, FileText, Calendar, FileCheck, ArrowRightLeft } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface LeaveTypesCardViewProps {
  leaveTypes: LeaveType[];
  isLoading: boolean;
  onEdit: (leaveType: LeaveType) => void;
  onDelete: (leaveType: LeaveType) => void;
}

export function LeaveTypesCardView({
  leaveTypes,
  isLoading,
  onEdit,
  onDelete,
}: LeaveTypesCardViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (leaveTypes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{_.leaves.noLeaveTypes}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leaveTypes.map((leaveType) => (
        <Card key={leaveType.id} className={!leaveType.active ? 'opacity-60' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {leaveType.name}
                </CardTitle>
                {leaveType.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {leaveType.description}
                  </p>
                )}
              </div>
              <Badge variant={leaveType.active ? 'default' : 'secondary'}>
                {leaveType.active ? _.active : _.inactive}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Max Days</p>
                  <p className="text-lg font-bold">{leaveType.max_days_per_year}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck className={`h-4 w-4 ${leaveType.requires_document ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className="text-xs">{_.leaves.RequiresDocument}</span>
                  {leaveType.requires_document ? (
                    <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />
                  ) : (
                    <XCircle className="h-3 w-3 text-muted-foreground ml-auto" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRightLeft className={`h-4 w-4 ${leaveType.carry_forward ? 'text-blue-600' : 'text-muted-foreground'}`} />
                  <span className="text-xs">{_.leaves.CarryForward}</span>
                  {leaveType.carry_forward ? (
                    <CheckCircle className="h-3 w-3 text-blue-600 ml-auto" />
                  ) : (
                    <XCircle className="h-3 w-3 text-muted-foreground ml-auto" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(leaveType)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onDelete(leaveType)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}