"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AppSidebar } from "~/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import Alert from "./alert";
import { NewPanelNotification } from "./new-panel-notification";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [parent] = useAutoAnimate();
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="mx-auto w-full max-w-screen-xl px-4" ref={parent}>
            <NewPanelNotification />
            {children}
          </div>
          <Alert />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
