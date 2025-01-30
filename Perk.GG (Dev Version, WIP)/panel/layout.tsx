"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import React from 'react';
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { CommandPaletteButton } from "./cmdk-button";
import { CommandPaletteProvider } from "./panel-command-palette";
import { data, PanelSidebar, ServersSidebar, UsersSidebar } from "./panel-sidebar";
import { FilesSidebar } from "./sidebar/files";

type ActiveItemType = typeof data.navMain[0];

const getSecondSidebar = (pathname: string) => {
    if (pathname.includes("/server")) {
        return <FilesSidebar />;
    }
    switch (pathname) {
        case '':
            return <ServersSidebar />;
        case '/panel/users':
            return <UsersSidebar />;
        // Add more cases for different routes
        default:
            return <ServersSidebar />;
    }
};

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const secondSidebar = getSecondSidebar(pathname);
    const hasSecondSidebar = Boolean(secondSidebar);

    return (
        <CommandPaletteProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": hasSecondSidebar ? "350px" : "64px",
                    } as React.CSSProperties
                }
                open={hasSecondSidebar ? undefined : false}
            >
                <PanelSidebar secondSidebar={secondSidebar} />
                <SidebarInset>
                    <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                        {hasSecondSidebar && (
                            <>
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-0 h-4" />
                            </>
                        )}
                        <ThemeSwitcher />
                        <Separator orientation="vertical" className="mr-0 h-4" />
                        <OrganizationSwitcher />
                        <Separator orientation="vertical" className="mr-0 h-4" />
                        <CommandPaletteButton />
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </CommandPaletteProvider>
    );
}
