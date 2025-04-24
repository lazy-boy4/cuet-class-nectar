
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import { mockClasses } from "@/api/mockData/classes";
import { User } from "@/types";

const PromoteCRs = () => {
  const { toast } = useToast();
  
  // Filter only student users
  const students = mockUsers.filter((user) => user.role === "student");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [crStatus, setCrStatus] = useState<Record<string, boolean>>({});
  
  // Initialize CR status from mock data
  React.useEffect(() => {
    const initialStatus: Record<string, boolean> = {};
    students.forEach((student) => {
      initialStatus[student.id] = student.isClassRepresentative || false;
    });
    setCrStatus(initialStatus);
  }, []);
  
  // Handle CR toggle
  const handleCrToggle = (studentId: string, newStatus: boolean) => {
    setCrStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: newStatus,
    }));
    
    const student = students.find((s) => s.id === studentId);
    if (student) {
      toast({
        title: newStatus ? "CR Promoted" : "CR Demoted",
        description: `${student.name} has been ${newStatus ? "promoted to" : "demoted from"} Class Representative.`,
      });
    }
  };
  
  // Get unique sessions from students
  const sessions = Array.from(
    new Set(students.map((student) => student.session).filter(Boolean))
  );
  
  // Filter students based on search term and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearchTerm =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = departmentFilter ? student.department === departmentFilter : true;
    
    const matchesSession = sessionFilter ? student.session === sessionFilter : true;
    
    return matchesSearchTerm && matchesDepartment && matchesSession;
  });
  
  // Get class information for a student
  const getClassInfo = (student: User) => {
    if (!student.department || !student.session || !student.section) {
      return "Not assigned";
    }
    
    return `${student.department} ${student.session} ${student.section}`;
  };
  
  return (
    <DashboardLayout
      title="Promote Class Representatives"
      description="Designate students as Class Representatives (CR) for their respective classes"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm border-white/10"
            />
          </div>
          
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[200px] border-white/10">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {mockDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={sessionFilter}
            onValueChange={setSessionFilter}
          >
            <SelectTrigger className="w-[150px] border-white/10">
              <SelectValue placeholder="All Sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sessions</SelectItem>
              {sessions.map((session) => (
                <SelectItem key={session} value={session}>
                  {session}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] text-white/70">Name</TableHead>
              <TableHead className="text-white/70">Email</TableHead>
              <TableHead className="text-white/70">Class</TableHead>
              <TableHead className="text-white/70">Department</TableHead>
              <TableHead className="text-center text-white/70">CR Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-white">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-white/70">{student.email}</TableCell>
                  <TableCell className="text-white/70">
                    {getClassInfo(student)}
                  </TableCell>
                  <TableCell className="text-white/70">
                    {student.department}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Switch
                        id={`cr-switch-${student.id}`}
                        checked={crStatus[student.id] || false}
                        onCheckedChange={(checked) => 
                          handleCrToggle(student.id, checked)
                        }
                      />
                      <span className={`text-sm ${crStatus[student.id] ? "text-green-400" : "text-white/50"}`}>
                        {crStatus[student.id] ? "CR" : "Student"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <p className="text-white/70">No students found.</p>
                  <p className="text-sm text-white/50">
                    Try adjusting your search or filters.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default PromoteCRs;
