"use client";

import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { type employees, type employeeTags } from "~/server/db/schema";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";

type Employee = typeof employees.$inferSelect & {
  tags: {
    tag: typeof employeeTags.$inferSelect;
  }[];
};

export default function EmployeesPage() {
  const { data: employees, refetch: refetchEmployees } = api.employee.getAll.useQuery();
  const { data: tags, refetch: refetchTags } = api.employeeTag.getAll.useQuery();
  const createEmployee = api.employee.create.useMutation();
  const updateEmployee = api.employee.update.useMutation();
  const deleteEmployee = api.employee.delete.useMutation();
  const createTag = api.employeeTag.create.useMutation();
  const deleteTag = api.employeeTag.delete.useMutation();
  const updateTag = api.employeeTag.update.useMutation();
  const changeAllTags = api.employee.changeAllTags.useMutation();

  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isManageTagsDialogOpen, setIsManageTagsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingTag, setEditingTag] = useState<typeof employeeTags.$inferSelect | null>(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [pendingTags, setPendingTags] = useState<Record<number, number[]>>({});

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() === "") return;

    toast.promise(
      createEmployee.mutateAsync({
        name: newEmployeeName,
        builder: false
      }), {
      loading: 'Creating employee...',
      success: () => {
        void refetchEmployees();
        setNewEmployeeName("");
        setIsEmployeeDialogOpen(false);
        return 'Employee created successfully';
      },
      error: 'Failed to create employee'
    }
    );
  };

  const handleEditEmployee = () => {
    if (!editingEmployee || editingEmployee.name.trim() === "") return;

    toast.promise(
      updateEmployee.mutateAsync({
        id: editingEmployee.id,
        name: editingEmployee.name
      }), {
      loading: 'Updating employee...',
      success: () => {
        void refetchEmployees();
        setEditingEmployee(null);
        setIsEmployeeDialogOpen(false);
        return 'Employee updated successfully';
      },
      error: 'Failed to update employee'
    }
    );
  };

  const handleDeleteEmployee = (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    toast.promise(
      deleteEmployee.mutateAsync({ id }), {
      loading: 'Deleting employee...',
      success: () => {
        void refetchEmployees();
        return 'Employee deleted successfully';
      },
      error: 'Failed to delete employee'
    }
    );
  };

  const handleAddTag = () => {
    if (newTagName.trim() === "") return;

    toast.promise(
      createTag.mutateAsync({ name: newTagName }), {
      loading: 'Creating tag...',
      success: () => {
        void refetchTags();
        setNewTagName("");
        setIsTagDialogOpen(false);
        return 'Tag created successfully';
      },
      error: 'Failed to create tag'
    }
    );
  };

  const handleEditTag = () => {
    if (!editingTag || editingTag.name.trim() === "") return;

    toast.promise(
      updateTag.mutateAsync({
        id: editingTag.id,
        name: editingTag.name
      }), {
      loading: 'Updating tag...',
      success: () => {
        void refetchTags();
        setEditingTag(null);
        setIsTagDialogOpen(false);
        return 'Tag updated successfully';
      },
      error: 'Failed to update tag'
    }
    );
  };

  const handleDeleteTag = (id: number) => {
    toast.promise(
      deleteTag.mutateAsync({ id }), {
      loading: 'Deleting tag...',
      success: () => {
        void refetchTags();
        return 'Tag deleted successfully';
      },
      error: 'Failed to delete tag'
    }
    );
  };

  const handleManageTags = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setIsManageTagsDialogOpen(true);
    // Initialize pending tags for this employee
    const currentTags = employees?.find(e => e.id === employeeId)?.tags.map(t => t.tag.id) ?? [];
    setPendingTags(prev => ({ ...prev, [employeeId]: currentTags }));
  };

  const handleSaveTags = () => {
    if (!selectedEmployeeId || !pendingTags[selectedEmployeeId]) return;

    toast.promise(
      changeAllTags.mutateAsync({
        employeeId: selectedEmployeeId,
        tagIds: pendingTags[selectedEmployeeId]
      }), {
      loading: 'Saving tags...',
      success: () => {
        void refetchEmployees();
        setIsManageTagsDialogOpen(false);
        setPendingTags({});
        return 'Tags saved successfully';
      },
      error: 'Failed to save tags'
    }
    );
  };

  const handleCancelTags = () => {
    setPendingTags({});
    setIsManageTagsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10 p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Employees Section */}
        <div>
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl font-bold">Employees</h1>
            <Button onClick={() => setIsEmployeeDialogOpen(true)}>Add Employee</Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees?.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>
                      {pendingTags[employee.id]
                        ? tags?.filter(t => pendingTags[employee.id]?.includes(t.id)).map(t => t.name).join(", ")
                        : employee.tags.map(({ tag }) => tag.name).join(", ")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="trigger" size="trigger"><MoreHorizontal /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingEmployee(employee);
                              setIsEmployeeDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteEmployee(employee.id)}>
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleManageTags(employee.id)}
                          >
                            Manage Tags
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl font-bold">Tags</h1>
            <Button onClick={() => {
              setEditingTag(null);
              setNewTagName("");
              setIsTagDialogOpen(true);
            }}>Add Tag</Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags?.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="trigger" size="trigger"><MoreHorizontal /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingTag(tag);
                              setNewTagName(tag.name);
                              setIsTagDialogOpen(true);
                            }}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add/Edit Employee Dialog */}
        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter employee name"
                value={editingEmployee?.name ?? newEmployeeName}
                onChange={(e) =>
                  editingEmployee
                    ? setEditingEmployee({ ...editingEmployee, name: e.target.value })
                    : setNewEmployeeName(e.target.value)
                }
              />
            </div>
            <DialogFooter>
              {editingEmployee ? (
                <Button onClick={handleEditEmployee}>Save</Button>
              ) : (
                <Button onClick={handleAddEmployee}>Add</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Tag Dialog */}
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "Edit Tag" : "Add Tag"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  if (editingTag) {
                    setEditingTag({ ...editingTag, name: e.target.value });
                  }
                }}
              />
            </div>
            <DialogFooter>
              {editingTag ? (
                <Button onClick={handleEditTag}>Save</Button>
              ) : (
                <Button onClick={handleAddTag}>Add</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manage Tags Dialog */}
        <Dialog open={isManageTagsDialogOpen} onOpenChange={setIsManageTagsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {tags?.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedEmployeeId ? pendingTags[selectedEmployeeId]?.includes(tag.id) : false}
                    onCheckedChange={(checked) => {
                      if (selectedEmployeeId && tag.id) {
                        setPendingTags(prev => {
                          const newTags = checked
                            ? [...(prev[selectedEmployeeId] ?? []), tag.id]
                            : prev[selectedEmployeeId]?.filter(id => id !== tag.id) ?? [];
                          return { ...prev, [selectedEmployeeId]: newTags };
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`tag-${tag.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelTags}>Cancel</Button>
              <Button onClick={handleSaveTags}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
