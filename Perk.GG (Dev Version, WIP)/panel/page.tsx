"use client";

import { BoxesIcon, Clock, ServerIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Main } from "~/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function AdminPanel() {
  return (
    <Main>
      <div className="space-y-8">
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Welcome to the new Perk Dashboard!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="@container">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 @[32rem]:grid-cols-2 @[48rem]:grid-cols-3">
                <Link
                  href="/servers"
                  className="flex items-center rounded-md p-2 hover:bg-muted"
                >
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <ServerIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Servers</div>
                    <div className="text-sm text-muted-foreground">Manage your servers</div>
                  </div>
                </Link>
                <Link
                  href="/apps"
                  className="flex items-center rounded-md p-2 hover:bg-muted"
                >
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <BoxesIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">App Integrations</div>
                    <div className="text-sm text-muted-foreground">Configure your integrations</div>
                  </div>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center rounded-md p-2 hover:bg-muted"
                >
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <SettingsIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className="text-sm text-muted-foreground">Manage your settings</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Link href="/activity" className="text-sm text-muted-foreground hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <BoxesIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">Discord Integration Connected</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Just now
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      New app integration was configured successfully
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
