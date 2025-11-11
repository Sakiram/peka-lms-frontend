import { Button } from '@/components/ui/shadcn/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeSwitcher() {
  const { colorScheme, mode, changeScheme, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Color Scheme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => changeScheme('default')}
            className={colorScheme === 'default' ? 'bg-accent' : ''}
          >
            Default
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeScheme('purple')}
            className={colorScheme === 'purple' ? 'bg-accent' : ''}
          >
            Purple
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeScheme('caffine')}
            className={colorScheme === 'caffine' ? 'bg-accent' : ''}
          >
            caffine
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Light/Dark Mode Toggle */}
      <Button variant="outline" size="icon" onClick={toggleMode}>
        {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </div>
  );
}