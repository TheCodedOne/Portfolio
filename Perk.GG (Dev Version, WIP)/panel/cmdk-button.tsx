"use client"

import { Button } from "~/components/ui/button"
import { useCommandPalette } from "./panel-command-palette"

export function CommandPaletteButton() {
  const { setOpen } = useCommandPalette()

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      onClick={() => setOpen(true)}
    >
      <span className="inline-flex">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
