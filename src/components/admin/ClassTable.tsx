
import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
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
import { Class } from "@/types";

interface ClassTableProps {
  classes: Class[];
  loading: boolean;
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onView?: (classItem: Class) => void;
}

const ClassTable = ({ classes, loading, onEdit, onDelete, onView }: ClassTableProps) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-8 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/70">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
        <h3 className="text-lg font-medium text-white mb-2">No Classes Found</h3>
        <p className="text-white/70">Create your first class to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white/70">Class Code</TableHead>
            <TableHead className="text-white/70">Course</TableHead>
            <TableHead className="text-white/70">Department</TableHead>
            <TableHead className="text-white/70">Section</TableHead>
            <TableHead className="text-white/70">Session</TableHead>
            <TableHead className="text-white/70">Teacher</TableHead>
            <TableHead className="text-white/70 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-white">
                {classItem.code || `${classItem.departmentCode}-${classItem.section}`}
              </TableCell>
              <TableCell className="text-white/90">
                <div>
                  <div className="font-medium">{classItem.courseName}</div>
                  <div className="text-sm text-white/60">{classItem.courseCode}</div>
                </div>
              </TableCell>
              <TableCell className="text-white/90">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                  {classItem.departmentCode}
                </Badge>
              </TableCell>
              <TableCell className="text-white/90">{classItem.section}</TableCell>
              <TableCell className="text-white/90">{classItem.session}</TableCell>
              <TableCell className="text-white/90">
                {classItem.teacherName || "Not Assigned"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(classItem)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(classItem)}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(classItem)}
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

export default ClassTable;
