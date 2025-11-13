import { Button } from '@/components/ui/shadcn/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/shadcn/dropdown-menu';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import * as _ from '@/constants/en.json';

export function ThemeSwitcher() {
  const { colorScheme, mode, changeScheme, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
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
            {_.themes[0]}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeScheme('purple')}
            className={colorScheme === 'purple' ? 'bg-accent' : ''}
          >
            {_.themes[1]}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeScheme('blue')}
            className={colorScheme === 'blue' ? 'bg-accent' : ''}
          >
            {_.themes[2]}
          </DropdownMenuItem>
           <DropdownMenuItem
            onClick={() => changeScheme('pink')}
            className={colorScheme === 'pink' ? 'bg-accent' : ''}
          >
            {_.themes[3]}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeScheme('claude')}
            className={colorScheme === 'claude' ? 'bg-accent' : ''}
          >
            {_.themes[4]}
          </DropdownMenuItem>
           <DropdownMenuItem
            onClick={() => changeScheme('cyberPunk')}
            className={colorScheme === 'cyberPunk' ? 'bg-accent' : ''}
          >
            {_.themes[5]}
          </DropdownMenuItem>
           <DropdownMenuItem
            onClick={() => changeScheme('t3')}
            className={colorScheme === 't3' ? 'bg-accent' : ''}
          >
            {_.themes[6]}
          </DropdownMenuItem>
           <DropdownMenuItem
            onClick={() => changeScheme('vintage')}
            className={colorScheme === 'vintage' ? 'bg-accent' : ''}
          >
            {_.themes[7]}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="icon" onClick={toggleMode}>
        {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </div>
  );
}