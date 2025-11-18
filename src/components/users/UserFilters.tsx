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
import { Search, X, Loader, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as _ from '@/constants/en.json';

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
  const [isExpanded, setIsExpanded] = useState(true);
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

  const activeFiltersCount = [filters.role, filters.status].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background/95 to-muted/50 backdrop-blur-xl shadow-lg"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Filters</h3>
            <p className="text-xs text-muted-foreground">
              {activeFiltersCount > 0 
                ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`
                : 'Search and filter users'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="h-8 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative group"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Search by name, email, or username..."
                  value={filters.search}
                  onChange={(e) => handleChange('search', e.target.value)}
                  className="pl-12 pr-12 h-12 bg-background/60 backdrop-blur-sm border-border/60 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
                  disabled={isLoading}
                />
                {searchLoading && (
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <Loader className="h-5 w-5 text-primary animate-spin" />
                  </motion.div>
                )}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Select
                    value={filters.role === '' ? 'all-roles' : filters.role}
                    onValueChange={(value) =>
                      handleChange('role', value === 'all-roles' ? '' : value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 bg-background/60 backdrop-blur-sm border-border/60 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-shadow" />
                        <SelectValue placeholder="All Roles" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 bg-background/95 backdrop-blur-xl">
                      <SelectItem value="all-roles" className="rounded-lg">
                        {_.roles[4]}
                      </SelectItem>
                      <SelectItem value="ADMIN" className="rounded-lg">
                        {_.roles[3]}
                      </SelectItem>
                      <SelectItem value="HR" className="rounded-lg">
                        {_.roles[2]}
                      </SelectItem>
                      <SelectItem value="MANAGER" className="rounded-lg">
                        {_.roles[1]}
                      </SelectItem>
                      <SelectItem value="EMPLOYEE" className="rounded-lg">
                        {_.roles[0]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Select
                    value={filters.status === '' ? 'all-status' : filters.status}
                    onValueChange={(value) =>
                      handleChange('status', value === 'all-status' ? '' : value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 bg-background/60 backdrop-blur-sm border-border/60 rounded-xl hover:border-green-500/50 hover:bg-green-500/5 transition-all group">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-shadow" />
                        <SelectValue placeholder="All Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 bg-background/95 backdrop-blur-xl">
                      <SelectItem value="all-status" className="rounded-lg">
                        {_.allStatus}
                      </SelectItem>
                      <SelectItem value="ACTIVE" className="rounded-lg">
                        {_.active}
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="rounded-lg">
                        {_.inactive}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pt-2 border-t border-border/40"
                  >
                    {filters.role && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm"
                      >
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          {filters.role}
                        </span>
                        <button
                          onClick={() => handleChange('role', '')}
                          className="hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    )}
                    {filters.status && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm"
                      >
                        <span className="text-green-700 dark:text-green-300 font-medium">
                          {filters.status}
                        </span>
                        <button
                          onClick={() => handleChange('status', '')}
                          className="hover:bg-green-500/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}