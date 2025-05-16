
import React from "react";
import { Department } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  departments: Department[];
  loading: boolean;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

const DepartmentTable: React.FC<Props> = ({ departments, loading, onEdit, onDelete }) => {
  if (loading) return <div className="text-gray-300">Loading departments...</div>;
  if (departments.length === 0) return <div className="text-gray-400 mt-12 text-center">No departments found.</div>;

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-24 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-semibold">{dept.code}</TableCell>
              <TableCell>{dept.name}</TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => onEdit(dept)}>
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(dept)}>
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

export default DepartmentTable;
