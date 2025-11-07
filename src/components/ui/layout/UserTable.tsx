import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Badge } from '@/components/ui/shadcn/badge';
import type { User } from '@/api/endpoints/users';
import { format } from 'date-fns';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 w-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground w-full">
        <p>No users found</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'destructive',
      HR: 'default',
      MANAGER: 'secondary',
      EMPLOYEE: 'outline',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="whitespace-nowrap">Username</TableHead>
            <TableHead className="whitespace-nowrap">Role</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Join Date</TableHead>
            <TableHead className="whitespace-nowrap">Manager</TableHead>
            <TableHead className="whitespace-nowrap">Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="whitespace-nowrap">{user.email}</TableCell>
              <TableCell className="whitespace-nowrap">{user.username}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={getRoleColor(user.role) as any}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={getStatusColor(user.status) as any}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(user.join_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {user.manager?.username || '-'}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {user.contact_no || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}