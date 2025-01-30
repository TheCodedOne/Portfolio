"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { Project, ProjectDataTable } from "../ProjectDataTable";

export default function CompletedProjectsPage() {
  const { data: projects, isLoading, refetch } = api.project.getAll.useQuery();
  const deleteProject = api.project.delete.useMutation();
  
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

  const completedProjects = projects?.filter(p => p.status === "archived") ?? [];

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

  return (
    <div className="w-full gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Completed Projects</h1>
      </div>

      <ProjectDataTable
        projects={completedProjects}
        isLoading={isLoading}
        onDelete={handleDelete}
        defaultVisibility={{
          submitDate: true,
          completionDate: true,
        }}
      />

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
