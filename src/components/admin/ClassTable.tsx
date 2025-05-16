
import React from "react";
import { Class } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassTableProps {
  classes: Class[];
  loading: boolean;
  onEdit: (cls: Class) => void;
  onDelete: (cls: Class) => void;
  getDepartmentName: (departmentCode: string) => string;
}

const ClassTable: React.FC<ClassTableProps> = ({ classes, loading, onEdit, onDelete, getDepartmentName }) => {
  if (loading) return <div className="text-gray-300">Loading classes...</div>;
  if (classes.length === 0) return <div className="text-gray-400 mt-12 text-center">No classes found.</div>;

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Code</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Section</TableHead>
            <TableHead className="w-24 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell>{cls.code || cls.courseCode}</TableCell>
              <TableCell>{cls.courseName}</TableCell>
              <TableCell>{getDepartmentName(cls.departmentCode)}</TableCell>
              <TableCell>{cls.session}</TableCell>
              <TableCell>{cls.section}</TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => onEdit(cls)}>
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(cls)}>
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassTable;
