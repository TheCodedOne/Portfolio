"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { type discordChannels } from "~/server/db/schema";
import { api } from "~/trpc/react";

type DiscordChannel = typeof discordChannels.$inferSelect;

export default function DiscordChannelsPage() {
    const { data: channels, refetch: refetchChannels } = api.discord.getAll.useQuery();
    const createChannel = api.discord.create.useMutation();
    const updateChannel = api.discord.update.useMutation();
    const deleteChannel = api.discord.delete.useMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<DiscordChannel | null>(null);
    const [channelId, setChannelId] = useState("");
    const [channelName, setChannelName] = useState("");

    const handleAddChannel = () => {
        if (channelId.trim() === "" || channelName.trim() === "") return;

        toast.promise(
            createChannel.mutateAsync({
                channelId,
                channelName
            }), {
            loading: 'Creating discord channel...',
            success: () => {
                void refetchChannels();
                setChannelId("");
                setChannelName("");
                setIsDialogOpen(false);
                return 'Discord channel created successfully';
            },
            error: 'Failed to create discord channel'
        }
        );
    };

    const handleEditChannel = () => {
        if (!editingChannel) return;

        toast.promise(
            updateChannel.mutateAsync({
                id: editingChannel.id,
                channelId: editingChannel.channelId,
                channelName: editingChannel.channelName
            }), {
            loading: 'Updating discord channel...',
            success: () => {
                void refetchChannels();
                setEditingChannel(null);
                setIsDialogOpen(false);
                return 'Discord channel updated successfully';
            },
            error: 'Failed to update discord channel'
        }
        );
    };

    const handleDeleteChannel = (id: number) => {
        if (!confirm("Are you sure you want to delete this discord channel?")) return;

        toast.promise(
            deleteChannel.mutateAsync({ id }), {
            loading: 'Deleting discord channel...',
            success: () => {
                void refetchChannels();
                return 'Discord channel deleted successfully';
            },
            error: 'Failed to delete discord channel'
        }
        );
    };

    return (
        <div className="container mx-auto py-10 p-4">
            <div className="flex items-center justify-between py-4">
                <h1 className="text-xl font-bold">Discord Channels</h1>
                <Button onClick={() => {
                    setEditingChannel(null);
                    setChannelId("");
                    setChannelName("");
                    setIsDialogOpen(true);
                }}>Add Discord Channel</Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Channel ID</TableHead>
                            <TableHead>Channel Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {channels?.map((channel) => (
                            <TableRow key={channel.id}>
                                <TableCell>{channel.id}</TableCell>
                                <TableCell>{channel.channelId}</TableCell>
                                <TableCell>{channel.channelName}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="trigger" size="trigger"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingChannel(channel);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteChannel(channel.id)}>
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
                            {editingChannel ? "Edit Discord Channel" : "Add Discord Channel"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Channel ID</Label>
                            <Input
                                placeholder="Enter discord channel ID"
                                value={editingChannel?.channelId ?? channelId}
                                onChange={(e) =>
                                    editingChannel
                                        ? setEditingChannel({ ...editingChannel, channelId: e.target.value })
                                        : setChannelId(e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Channel Name</Label>
                            <Input
                                placeholder="Enter discord channel name"
                                value={editingChannel?.channelName ?? channelName}
                                onChange={(e) =>
                                    editingChannel
                                        ? setEditingChannel({ ...editingChannel, channelName: e.target.value })
                                        : setChannelName(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {editingChannel ? (
                            <Button onClick={handleEditChannel}>Save</Button>
                        ) : (
                            <Button onClick={handleAddChannel}>Add</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
