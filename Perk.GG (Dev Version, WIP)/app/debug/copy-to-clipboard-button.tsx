"use client";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

export function CopyToClipboardButton({ text }: { text: string }) {
  return (
    <Button
      className="mx-auto"
      onClick={() => {
        toast.promise(navigator.clipboard.writeText(text), {
          loading: "Copying to clipboard...",
          success: "Copied to clipboard",
          error: "Failed to copy to clipboard",
        });
      }}
    >
      Copy to clipboard
    </Button>
  );
}
