"use client";

import { AlertCircle, AlertTriangle, InfoIcon, MoreHorizontal, PencilIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { type employeeTags, type projectTypes, type discordChannels } from "~/server/db/schema";
import { api } from "~/trpc/react";

type ProjectType = typeof projectTypes.$inferSelect & {
  requiredTag?: typeof employeeTags.$inferSelect;
  discordChannel?: typeof discordChannels.$inferSelect;
};

export default function ProjectTypesPage() {
  const { data: projectTypes, refetch: refetchProjectTypes } = api.projectType.getAll.useQuery();
  const { data: tags } = api.employeeTag.getAll.useQuery();
  const { data: channels } = api.discord.getAll.useQuery();
  const createProjectType = api.projectType.create.useMutation();
  const updateProjectType = api.projectType.update.useMutation();
  const deleteProjectType = api.projectType.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProjectType | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [category, setCategory] = useState<"submission" | "deadline">("submission");
  const [processingTime, setProcessingTime] = useState("0");
  const [requiresEmployee, setRequiresEmployee] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>();
  const [selectedChannelId, setSelectedChannelId] = useState<number | undefined>();

  const handleAddType = () => {
    if (newTypeName.trim() === "") return;

    toast.promise(
      createProjectType.mutateAsync({
        name: newTypeName,
        category,
        defaultProcessingTime: category === "deadline" ? 0 : parseInt(processingTime),
        requiresEmployee,
        requiredTagId: selectedTagId,
        discordChannelId: selectedChannelId
      }), {
      loading: 'Creating project type...',
      success: () => {
        void refetchProjectTypes();
        setNewTypeName("");
        setIsDialogOpen(false);
        return 'Project type created successfully';
      },
      error: 'Failed to create project type'
    }
    );
  };

  const handleEditType = () => {
    if (!editingType || editingType.name.trim() === "") return;

    toast.promise(
      updateProjectType.mutateAsync({
        id: editingType.id,
        name: editingType.name,
        category,
        defaultProcessingTime: category === "deadline" ? 0 : parseInt(processingTime),
        requiresEmployee,
        requiredTagId: selectedTagId,
        discordChannelId: selectedChannelId
      }), {
      loading: 'Updating project type...',
      success: () => {
        void refetchProjectTypes();
        setEditingType(null);
        setIsDialogOpen(false);
        return 'Project type updated successfully';
      },
      error: 'Failed to update project type'
    }
    );
  };

  const handleDeleteType = (id: number) => {
    if (!confirm("Are you sure you want to delete this project type?")) return;

    toast.promise(
      deleteProjectType.mutateAsync({ id }), {
      loading: 'Deleting project type...',
      success: () => {
        void refetchProjectTypes();
        return 'Project type deleted successfully';
      },
      error: 'Failed to delete project type'
    }
    );
  };

  return (
    <div className="container mx-auto py-10 p-4">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold">Project Types</h1>
        <Button onClick={() => {
          setEditingType(null);
          setNewTypeName("");
          setCategory("submission");
          setProcessingTime("0");
          setRequiresEmployee(false);
          setSelectedTagId(undefined);
          setSelectedChannelId(undefined);
          setIsDialogOpen(true);
        }}>Add Project Type</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Processing Time</TableHead>
              <TableHead>Requires Employee</TableHead>
              <TableHead>Required Tag</TableHead>
              <TableHead>Discord Channel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectTypes?.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.id}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell className="capitalize">{type.category}</TableCell>
                <TableCell>{type.category === "deadline" ? "-" : `${type.defaultProcessingTime} days`}</TableCell>
                <TableCell>{type.requiresEmployee ? "Yes" : "No"}</TableCell>
                <TableCell>{tags?.find(t => t.id === type.requiredTagId)?.name ?? "-"}</TableCell>
                <TableCell>{channels?.find(c => c.id === type.discordChannelId)?.channelName ??
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="warning">
                          <AlertTriangle className="size-3 mr-0.5" />
                          No Channel Set
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-orange-500">
                        <p>No notifications will be sent if no channel is set</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="trigger" size="trigger"><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingType({
                            ...type,
                            requiredTag: type.requiredTag ?? undefined,
                            discordChannel: type.discordChannel ?? undefined
                          });
                          setNewTypeName(type.name);
                          setCategory(type.category);
                          setProcessingTime(type.defaultProcessingTime?.toString() ?? "0");
                          setRequiresEmployee(type.requiresEmployee);
                          setSelectedTagId(type.requiredTagId ?? undefined);
                          setSelectedChannelId(type.discordChannelId ?? undefined);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteType(type.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Project Type" : "Add Project Type"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Enter project type name"
                value={editingType?.name ?? newTypeName}
                onChange={(e) =>
                  editingType
                    ? setEditingType({ ...editingType, name: e.target.value })
                    : setNewTypeName(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(val: "submission" | "deadline") => setCategory(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submission">Submission</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {category === "submission" && (
              <div className="space-y-2">
                <Label>Processing Time (days)</Label>
                <Input
                  type="number"
                  value={processingTime}
                  onChange={(e) => setProcessingTime(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires-employee"
                checked={requiresEmployee}
                onCheckedChange={(checked) => setRequiresEmployee(!!checked)}
              />
              <Label htmlFor="requires-employee">Requires Employee</Label>
            </div>

            {requiresEmployee && (
              <div className="space-y-2">
                <Label>Required Tag</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedTagId?.toString() ?? "none"}
                    onValueChange={(val) => setSelectedTagId(val === "none" ? undefined : parseInt(val))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Required Tag</SelectItem>
                      {tags?.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Discord Channel</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedChannelId?.toString() ?? "none"}
                  onValueChange={(val) => setSelectedChannelId(val === "none" ? undefined : parseInt(val))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discord Channel</SelectItem>
                    {channels?.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id.toString()}>
                        {channel.channelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            {editingType ? (
              <Button onClick={handleEditType}>Save</Button>
            ) : (
              <Button onClick={handleAddType}>Add</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
