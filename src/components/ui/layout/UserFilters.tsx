import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Search, X } from 'lucide-react';

interface UsersFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  isLoading: boolean;
}

export interface FilterValues {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  order: 'asc' | 'desc';
}

const defaultFilters: FilterValues = {
  search: '',
  role: '',
  status: '',
  sortBy: 'username',
  order: 'asc',
};

export function UsersFilters({ onFiltersChange, isLoading }: UsersFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const handleChange = useCallback(
    (key: keyof FilterValues, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
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
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Role Filter - Fixed */}
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

        {/* Status Filter - Fixed */}
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

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleChange('sortBy', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="username">Username</SelectItem>
            <SelectItem value="first_name">First Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="join_date">Join Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Order */}
        <Select
          value={filters.order}
          onValueChange={(value) => 
            handleChange('order', value as 'asc' | 'desc')
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          size="sm"
          className="w-full"
        >
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
