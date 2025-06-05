
import React from "react";
import { Edit, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  userType: "student" | "teacher";
}

const UserTable = ({ users, loading, onEdit, onDelete, userType }: UserTableProps) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/70">Loading {userType}s...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
        <h3 className="text-lg font-medium text-white mb-2">No {userType}s Found</h3>
        <p className="text-white/70">Add {userType}s to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white/70">Name</TableHead>
            <TableHead className="text-white/70">Email</TableHead>
            <TableHead className="text-white/70">Department</TableHead>
            {userType === "student" && (
              <>
                <TableHead className="text-white/70">Session</TableHead>
                <TableHead className="text-white/70">Section</TableHead>
                <TableHead className="text-white/70">CR Status</TableHead>
              </>
            )}
            <TableHead className="text-white/70 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-white">
                <div className="flex items-center space-x-3">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-white/90">{user.email}</TableCell>
              <TableCell className="text-white/90">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                  {user.department}
                </Badge>
              </TableCell>
              {userType === "student" && (
                <>
                  <TableCell className="text-white/90">{user.session}</TableCell>
                  <TableCell className="text-white/90">{user.section}</TableCell>
                  <TableCell className="text-white/90">
                    {user.isClassRepresentative && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                        <Crown size={12} className="mr-1" />
                        CR
                      </Badge>
                    )}
                  </TableCell>
                </>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
