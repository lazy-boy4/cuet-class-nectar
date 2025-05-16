
import React from "react";
import { Course } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  getDepartmentName: (departmentId: string | undefined, departmentCode?: string) => string;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, loading, onEdit, onDelete, getDepartmentName }) => {
  if (loading) return <div className="text-gray-300">Loading courses...</div>;
  if (courses.length === 0) return <div className="text-gray-400 mt-12 text-center">No courses found.</div>;

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead className="w-24 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-semibold">{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{getDepartmentName(course.departmentId, course.departmentCode)}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(course)}>
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

export default CourseTable;
