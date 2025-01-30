"use client";

import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

export function NewPanelNotification() {
    const router = useRouter();

    const handleTryNewPanel = () => {
        document.cookie = `experiment:new-panel=true; path=/`;
        router.refresh();
    };

    return (
        <div>
            <Alert className="mx-auto mb-6 max-w-screen-sm">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>New Panel Available!</AlertTitle>
                <AlertDescription className="font-medium">
                    We&apos;ve updated our panel with new features and improvements.
                </AlertDescription>
                <Button variant="outline" className="mt-2" onClick={handleTryNewPanel}>
                    Try it now
                </Button>
            </Alert>
        </div>
    );
}
