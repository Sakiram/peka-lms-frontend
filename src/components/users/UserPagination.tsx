import { Button } from '@/components/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as _ from '@/constants/en.json';

interface UsersPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function UsersPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: UsersPaginationProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-6 p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {total} users
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">{_.items_per_page}</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">{_.pages[0]}</SelectItem>
              <SelectItem value="10">{_.pages[1]}</SelectItem>
              <SelectItem value="25">{_.pages[2]}</SelectItem>
              <SelectItem value="50">{_.pages[3]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          {_.next}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}