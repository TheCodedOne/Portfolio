"use client";

import * as React from "react";
import { ProjectDataTable, type Project } from "./ProjectDataTable";
import { api, RouterOutputs } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  SelectValue,
} from "~/components/ui/select";

const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  typeId: z.number({ required_error: "Type is required" }),
  submitDate: z.date().optional(),
  deadlineDate: z.date().optional(),
  employeeId: z.number().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectType = RouterOutputs["projectType"]["getAll"][number];

export default function ProjectsPage() {
  const { data: projects, isLoading, refetch } = api.project.getAll.useQuery();
  const { data: projectTypes } = api.projectType.getAll.useQuery();
  const { data: employees } = api.employee.getAll.useQuery();
  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      void refetch();
    }
  });
  const updateProject = api.project.update.useMutation();
  const deleteProject = api.project.delete.useMutation();
  const markCompleted = api.project.markCompleted.useMutation();

  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<ProjectType | null>(null);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm: () => {},
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      submitDate: undefined,
      deadlineDate: undefined,
      employeeId: undefined,
    },
  });

  const activeProjects = projects?.filter(p => p.status === "active") ?? [];
  const submissionProjects = activeProjects.filter(p => p.type.category === "submission");
  const deadlineProjects = activeProjects.filter(p => p.type.category === "deadline");

  const filteredEmployees = React.useMemo(() => {
    if (!selectedType?.requiredTag) return employees;
    return employees?.filter(e => e.tags.some(t => t.tagId === selectedType.requiredTag?.id));
  }, [employees, selectedType?.requiredTag]);

  React.useEffect(() => {
    if (editingProject) {
      const projectType = projectTypes?.find(t => t.id === editingProject.typeId);
      setSelectedType(projectType ?? null);
      form.reset({
        name: editingProject.name,
        typeId: editingProject.typeId,
        submitDate: editingProject.submitDate,
        deadlineDate: editingProject.deadlineDate,
        employeeId: editingProject.employeeId ?? undefined,
      });
    } else {
      setSelectedType(null);
      form.reset({
        name: "",
        submitDate: undefined,
        deadlineDate: undefined,
        employeeId: undefined,
      });
    }
  }, [editingProject, form, projectTypes]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Validate required fields based on project type
      if (selectedType?.category === "submission" && !data.submitDate) {
        form.setError("submitDate", {
          type: "required",
          message: "Submit date is required for submission projects"
        });
        return;
      }

      if (selectedType?.category === "deadline" && !data.deadlineDate) {
        form.setError("deadlineDate", {
          type: "required",
          message: "Deadline date is required for deadline projects"
        });
        return;
      }

      // Check employee is required
      if (selectedType?.requiresEmployee && !data.employeeId) {
        form.setError("employeeId", {
          type: "required",
          message: "Employee is required for deadline projects"
        });
        return;
      }

      // Check if employee matches the required tag
      if (selectedType?.requiresEmployee && data.employeeId && !filteredEmployees?.some(e => e.id === data.employeeId)) {
        form.setError("employeeId", {
          type: "invalid",
          message: "Employee does not match the required tag"
        });
        return;
      }
      
      // Check if deadline is in the future
      if (selectedType?.category === "deadline" && data.deadlineDate && data.deadlineDate < new Date()) {
        form.setError("deadlineDate", {
          type: "invalid",
          message: "Deadline date must be in the future"
        });
        return;
      }

      const submissionData = {
        ...data,
        submitDate: selectedType?.category === "deadline" ? new Date() : data.submitDate!,
        deadlineDate: selectedType?.category === "submission"
          ? new Date(data.submitDate!.getTime() + ((selectedType.defaultProcessingTime ?? 0) * 24 * 60 * 60 * 1000))
          : data.deadlineDate!,
        employeeId: selectedType?.requiresEmployee ? data.employeeId : undefined,
      };

      if (editingProject) {
        toast.promise(
          updateProject.mutateAsync({
            id: editingProject.id,
            ...submissionData,
          }),
          {
            loading: 'Updating project...',
            success: () => {
              void refetch();
              return 'Project updated successfully';
            },
            error: 'Failed to update project'
          }
        );
      } else {
        toast.promise(
          createProject.mutateAsync(submissionData),
          {
            loading: 'Creating project...',
            success: () => {
              void refetch();
              return 'Project created successfully';
            },
            error: 'Failed to create project'
          }
        );
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      onConfirm: () => {
        toast.promise(deleteProject.mutateAsync({ id: project.id }), {
          loading: 'Deleting project...',
          success: () => {
            void refetch();
            return 'Project deleted successfully';
          },
          error: 'Failed to delete project'
        });
      }
    });
  };

  const handleMarkCompleted = (project: Project) => {
    console.log(project);
    setConfirmDialog({
      isOpen: true,
      title: "Mark Project as Completed",
      message: "Are you sure you want to mark this project as completed?",
      onConfirm: () => {
        toast.promise(markCompleted.mutateAsync({ id: project.id }), {
          loading: 'Marking project as completed...',
          success: () => {
            void refetch();
            return 'Project marked as completed';
          },
          error: 'Failed to mark project as completed'
        });
      }
    });
  };

  const handleTypeChange = (typeId: string) => {
    const projectType = projectTypes?.find(t => t.id === parseInt(typeId));
    setSelectedType(projectType ?? null);
    form.setValue("typeId", parseInt(typeId));
  };

  return (
    <div className="w-full gap-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Submission Projects</h2>
        <ProjectDataTable
          projects={submissionProjects}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          markCompleted={handleMarkCompleted}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Deadline Projects</h2>
        <ProjectDataTable
          projects={deadlineProjects}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          markCompleted={handleMarkCompleted}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={handleTypeChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType?.category === "submission" && (
                <FormField
                  control={form.control}
                  name="submitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submit Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType?.category === "deadline" && (
                <FormField
                  control={form.control}
                  name="deadlineDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType?.requiresEmployee && (
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredEmployees?.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit">
                {editingProject ? 'Update' : 'Create'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
          </DialogHeader>
          <p>{confirmDialog.message}</p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
              Cancel
            </Button>
            <Button onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
