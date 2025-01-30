import { AppSidebar } from "~/components/app-sidebar";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";

import { ModeToggle } from "~/components/theme-toggle";
import { SidebarProvider } from "~/components/ui/sidebar";
import LogoutButton from "./logout-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mr-0" />
          <ModeToggle />
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>);
}
