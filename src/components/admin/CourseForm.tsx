
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Course, Department } from "@/types";

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSubmit: (data: Omit<Course, "id">) => void;
  departments: Department[];
  loading: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  open,
  onOpenChange,
  course,
  onSubmit,
  departments,
  loading,
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Course, "id">>({
    defaultValues: course
      ? {
          code: course.code,
          name: course.name,
          credits: course.credits,
          departmentId: course.departmentId || "",
        }
      : {
          code: "",
          name: "",
          credits: 3,
          departmentId: "",
        },
  });

  React.useEffect(() => {
    if (course) {
      reset({
        code: course.code,
        name: course.name,
        credits: course.credits,
        departmentId: course.departmentId || "",
      });
    } else {
      reset({
        code: "",
        name: "",
        credits: 3,
        departmentId: "",
      });
    }
  }, [course, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add Course"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Course Code</label>
            <Input {...register("code", { required: "Code is required" })} placeholder="e.g. CSE-201" />
            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Course Name</label>
            <Input {...register("name", { required: "Name is required" })} placeholder="e.g. Data Structures" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Credits</label>
            <Input {...register("credits", { required: "Credits is required", valueAsNumber: true })} type="number" min={1} max={6} />
            {errors.credits && <p className="text-xs text-destructive mt-1">{errors.credits.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Department</label>
            <Select value={watch("departmentId")} onValueChange={val => setValue("departmentId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && <p className="text-xs text-destructive mt-1">{errors.departmentId.message}</p>}
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button disabled={loading} type="submit">
              {course ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm;
