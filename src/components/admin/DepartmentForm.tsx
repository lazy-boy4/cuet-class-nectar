
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Department } from "@/types";

export interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSubmit: (data: Omit<Department, "id">) => void;
  loading: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  open,
  onOpenChange,
  department,
  onSubmit,
  loading,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Department, "id">>({
    defaultValues: department ? { code: department.code, name: department.name } : { code: "", name: "" }
  });

  React.useEffect(() => {
    if (department) {
      reset({ code: department.code, name: department.name });
    } else {
      reset({ code: "", name: "" });
    }
  }, [department, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Department Code</label>
            <Input {...register("code", { required: "Code is required" })} placeholder="e.g. CSE" />
            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm text-muted-foreground font-medium">Department Name</label>
            <Input {...register("name", { required: "Name is required" })} placeholder="e.g. Computer Science and Engineering" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button disabled={loading} type="submit">
              {department ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentForm;
