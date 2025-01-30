"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

const ProjectFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.number().min(1, "Please select a project type"),
  employeeId: z.number().optional(),
  date: z.string().min(1, "Please select a date"),
});

type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

const ProjectCreationModal = () => {
  const [open, setOpen] = useState(false);

  const { data: projectTypes = [] } = api.projectType.getAll.useQuery();
  const { data: employees = [] } = api.employee.getAll.useQuery();
  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      projectName: "",
      projectType: 1,
      employeeId: undefined,
      date: "",
    },
  });

  const selectedProjectType = projectTypes.find(
    (type) => type.id === form.watch("projectType"),
  );

  const isSubmissionProject = selectedProjectType?.category === "submission";

  const handleFormSubmit = (values: ProjectFormValues) => {
    if (selectedProjectType?.requiresEmployee && !values.employeeId) {
      form.setError("employeeId", {
        message: "Employee is required for this project type.",
      });
      return;
    }
    const submitDate = selectedProjectType?.category === "submission" ? new Date(values.date) : new Date();
    let deadlineDate = selectedProjectType?.category === "deadline" ? new Date(values.date) : new Date();
    // Add processing time to submission date, which is in days
    if (selectedProjectType && selectedProjectType?.category === "submission") {
      deadlineDate = new Date(submitDate.getTime() + (selectedProjectType?.defaultProcessingTime ?? 0) * 24 * 60 * 60 * 1000);
    }
    createProject.mutate({
      name: values.projectName,
      typeId: values.projectType,
      employeeId: values.employeeId,
      submitDate: submitDate,
      deadlineDate: deadlineDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        {field.value 
                          ? projectTypes.find(t => t.id === field.value)?.name + 
                            ` (${projectTypes.find(t => t.id === field.value)?.category})`
                          : "Select a project type"
                        }
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name} ({type.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProjectType?.requiresEmployee && (
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Employee</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          {field.value
                            ? employees.find(e => e.id === field.value)?.name
                            : "Select an employee"}
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id.toString()}
                            >
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isSubmissionProject ? "Submission Date" : "Deadline Date"}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubmissionProject && selectedProjectType && (
              <div className="text-sm text-muted-foreground">
                Deadline will be {form.watch("date") && selectedProjectType.defaultProcessingTime
                  ? new Date(new Date(form.watch("date")).getTime() + selectedProjectType.defaultProcessingTime * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : "calculated based on submission date"}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationModal;
