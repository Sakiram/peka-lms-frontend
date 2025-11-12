import { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Search, X, Loader } from 'lucide-react';

interface UsersFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  isLoading: boolean;
}

export interface FilterValues {
  search: string;
  role: string;
  status: string;
}

const defaultFilters: FilterValues = {
  search: '',
  role: '',
  status: '',
};

export function UsersFilters({ onFiltersChange, isLoading }: UsersFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimer = useRef<number | null>(null);
  const handleChange = useCallback(
    (key: keyof FilterValues, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
       if (key === 'search') {
        setSearchLoading(true);
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          onFiltersChange(newFilters);
          setSearchLoading(false);
        }, 500);
      } else {
        onFiltersChange(newFilters);
      }
    },
    [filters, onFiltersChange]
  );

  const handleReset = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setFilters(defaultFilters);
    setSearchLoading(false);
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  return (
    <div className="space-y-4 mb-6 p-4 bg-muted rounded-lg">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {/* Show loading indicator while search is debouncing */}
          {searchLoading && (
            <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Select
          value={filters.role === '' ? 'all-roles' : filters.role}
          onValueChange={(value) => 
            handleChange('role', value === 'all-roles' ? '' : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-roles">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status === '' ? 'all-status' : filters.status}
          onValueChange={(value) => 
            handleChange('status', value === 'all-status' ? '' : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          size="sm"
          className="ml-auto w-fit"
        >
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
