"use client"

import * as React from "react"
import { Command, Server, Database, Users, Settings, Activity, Boxes } from "lucide-react"

import { NavUser } from "~/app/panel/nav-user"
import { Label } from "~/components/ui/label"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "~/components/ui/sidebar"
import { Switch } from "~/components/ui/switch"
import { Badge } from "~/components/ui/badge"
import Link from "next/link"
import { Logo } from "../home/logo"

// Sample data for server hosting panel
export const data = {
    user: {
        name: "Admin",
        email: "admin@example.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        {
            title: "Servers",
            url: "#",
            icon: Server,
            isActive: true,
        },
        {
            title: "Apps",
            url: "/apps",
            icon: Boxes,
            isActive: false,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
            isActive: false,
        },
    ],
    servers: [
        {
            name: "Minecraft Server",
            status: "Running", 
            uptime: "99.9%",
            date: "Online",
            details: "8 vCPUs, 16GB RAM\nPaper 1.20.4\nRegion: US-East",
        },
        {
            name: "Space Engineers",
            status: "Running",
            uptime: "99.7%",
            date: "Online", 
            details: "4 vCPUs, 8GB RAM\nVersion 1.201\nRegion: US-West",
        },
        {
            name: "Factorio",
            status: "Running",
            uptime: "99.8%",
            date: "Online",
            details: "4 vCPUs, 8GB RAM\nVersion 1.1.101\nRegion: EU-West",
        },
        {
            name: "Space Engineers 2",
            status: "Running",
            uptime: "99.5%",
            date: "Online",
            details: "8 vCPUs, 16GB RAM\nEarly Access\nRegion: US-East",
        }
    ],
}

export const ServersSidebar = () => {
    return (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
            <SidebarHeader className="gap-3.5 border-b p-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-base font-medium text-foreground">
                        Servers
                    </div>
                    <Label className="flex items-center gap-2 text-sm">
                        <span>Active Only</span>

                        <Switch className="shadow-none" />
                    </Label>
                </div>
                <SidebarInput placeholder="Search servers..." />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="px-0">
                    <SidebarGroupContent>
                        {data.servers.map((server) => (
                            <a
                                href="#"
                                key={server.name}

                                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <div className="flex w-full items-center gap-2">
                                    <span className="font-medium">{server.name}</span>
                                    <Badge className="ml-auto">{server.date}</Badge>
                                </div>
                                <div className="flex w-full items-center gap-2">
                                    <span className="text-xs">Status: {server.status}</span>
                                </div>
                                <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs text-muted-foreground">
                                    {server.details}
                                </span>
                            </a>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export const UsersSidebar = () => {
    return (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
            <SidebarHeader className="gap-3.5 border-b p-4">

                <div className="text-base font-medium text-foreground">
                    Users
                </div>
                <SidebarInput placeholder="Search users..." />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        {/* Add user list content here */}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

// Add more sidebar components for different routes...

type PanelSidebarProps = React.ComponentProps<typeof Sidebar> & {
    secondSidebar?: React.ReactNode;
};

export function PanelSidebar({ secondSidebar, ...props }: PanelSidebarProps) {
    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
            {...props}
        >
            <Sidebar
                collapsible="none"
                className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Logo className="fill-current p-1" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Server Panel</span>
                                        <span className="truncate text-xs">Admin Console</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {data.navMain.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                                hidden: false,
                                            }}
                                            asChild
                                            className="px-2.5 md:px-2"
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                {/* <SidebarFooter>
                    <NavUser user={data.user} />
                </SidebarFooter> */}
            </Sidebar>

            {secondSidebar}
        </Sidebar>
    );
}
