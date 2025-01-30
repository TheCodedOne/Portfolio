"use client"

import {
  Calculator,
  Calendar,
  CreditCard,
  Monitor,
  Moon,
  Settings,
  Smile,
  Sun,
  User
} from "lucide-react"
import * as React from "react"

import { useCommandState } from "cmdk"
import { useTheme } from "next-themes"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"

type CommandPaletteContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextType | undefined>(undefined);

export function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
  }
  return context;
}

function ThemeItems() {
  const { theme, setTheme } = useTheme()

  return (
    <>

      <CommandItem onSelect={() => setTheme(theme == "light" ? "dark" : "light")}>
        <Sun className="mr-2 h-4 w-4 dark:hidden" />
        <Moon className="mr-2 h-4 w-4 hidden dark:block" />
        <div className="flex flex-col">
          <span>Set theme to {theme == "light" ? "dark" : "light"}</span>
        </div>
      </CommandItem>

      <CommandItem onSelect={() => setTheme("system")}>
        <Monitor className="mr-2 h-4 w-4" />
        <div className="flex flex-col">
          <span>Match theme with system</span>
          <span className="text-xs text-muted-foreground">Current: {theme}</span>
        </div>
      </CommandItem>

    </>
  )
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Settings">
            <ThemeItems />
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  )
}