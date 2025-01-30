"use client"
import {
    CornerDownLeft,
    Cpu,
    HardDrive,
    MemoryStick,
    Orbit,
    Rocket,
    RotateCcw,
    Settings,
    SquarePower,
    User,
} from "lucide-react"

import { useMemo, useState, type FormEvent } from "react"
import { Main } from "~/components/layout/MainLayout"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip"

type ConsoleMessage = {
    message: string
    timestamp: number
}

function generateRandomUsername() {
    // Make it gamer usernames
    const adjectives = ["Awesome", "Brave", "Charming", "Daring", "Elegant", "Fierce", "Glamorous", "Heroic", "Legendary", "Majestic", "Noble", "Powerful", "Radiant", "Royal", "Stellar", "Titanic", "Ultimate", "Vast", "Wondrous", "Xtra", "Yummy", "Zesty"];
    const nouns = ["Dragon", "Eagle", "Falcon", "Gorilla", "Hawk", "Lion", "Owl", "Panther", "Phoenix", "Raptor", "Shark", "Tiger", "Vulture", "Wolf", "Xenon", "Yak", "Zebra"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}   

function generateRandomPlayer() {
    return {
        name: generateRandomUsername(),
        steamid: Math.floor(Math.random() * 99999999999).toString(),
    }
}

const players = Array.from({ length: 5 }, generateRandomPlayer)

export default function Dashboard() {
    const [stats, setStats] = useState({ cpu: 45.5, memory: 2500000 })
    const [status, setStatus] = useState<"starting" | "running" | "stopping" | "stopped">("stopped")
    const [messages, setMessages] = useState<ConsoleMessage[]>([
        { message: "Loading Steam SDK...", timestamp: Date.now() - 8000 },
        { message: "Logging in anonymously...", timestamp: Date.now() - 7000 },
        { message: "Logged in OK", timestamp: Date.now() - 6000 },
        { message: "Downloading update for Space Engineers Dedicated Server...", timestamp: Date.now() - 5000 },
        { message: "Update state (0x3) validating, progress: 12.84 (1537972 / 11974124)", timestamp: Date.now() - 4000 },
        { message: "Update state (0x3) validating, progress: 45.67 (5469012 / 11974124)", timestamp: Date.now() - 3000 },
        { message: "Update state (0x3) validating, progress: 89.32 (10695124 / 11974124)", timestamp: Date.now() - 2000 },
        { message: "Success! App '298740' fully installed.", timestamp: Date.now() - 1000 },
    ])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            message: { value: string }
        }
        setMessages(prev => [...prev, { message: `> ${target.message.value}`, timestamp: Date.now() }])
        target.message.value = ""
    }

    const isStart = useMemo(
        () => status === "starting" || status === "running",
        [status],
    )

    return (
        <Main>
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Space Engineers Server</h1>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Settings className="size-4" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-[80vh]">
                            <DrawerHeader>
                                <DrawerTitle>Configuration</DrawerTitle>
                                <DrawerDescription>
                                    Configure the settings for the model and messages.
                                </DrawerDescription>
                            </DrawerHeader>
                            <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Control
                                    </legend>
                                    <div className="grid gap-3">
                                        <Label htmlFor="model">Model</Label>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="temperature">Temperature</Label>
                                        <Input id="temperature" type="number" placeholder="0.4" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="top-p">Top P</Label>
                                        <Input id="top-p" type="number" placeholder="0.7" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="top-k">Top K</Label>
                                        <Input id="top-k" type="number" placeholder="0.0" />
                                    </div>
                                </fieldset>
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">
                                        Messages
                                    </legend>
                                    <div className="grid gap-3">
                                        <Label htmlFor="role">Role</Label>
                                        <Select defaultValue="system">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="system">System</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="assistant">Assistant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" placeholder="You are a..." />
                                    </div>
                                </fieldset>
                            </form>
                        </DrawerContent>
                    </Drawer>
                </header>
                <main className="grid flex-1 gap-4 overflow-auto p-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    <div
                        className="relative hidden flex-col items-start gap-8 lg:flex"
                        x-chunk="dashboard-03-chunk-0"
                    >
                        <form className="grid w-full items-start gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Control
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Power</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Button
                                            disabled={isStart}
                                            type="button"
                                            onClick={() => setStatus("starting")}
                                        >
                                            Start
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            disabled={!isStart}
                                            type="button"
                                            onClick={() => {
                                                setStatus("stopping")
                                                setTimeout(() => setStatus("starting"), 1000)
                                            }}
                                        >
                                            Restart
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            disabled={!isStart}
                                            type="button"
                                            onClick={() => setStatus("stopped")}
                                        >
                                            Stop
                                        </Button>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="grid grid-cols-2 rounded-lg border p-4 font-medium md:gap-6 xl:grid-cols-3">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Stats
                                </legend>
                                <div className="flex items-center gap-1">
                                    <Cpu className="size-5" />
                                    <span>{stats.cpu.toFixed(2)}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MemoryStick className="size-5" />
                                    <span>
                                        {(stats.memory / 1000000).toFixed(2)}MB
                                    </span>
                                    <span className="text-muted-foreground/60">/ 4GB</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HardDrive className="size-5" />
                                    <span>2.8GB</span>
                                    <span className="text-muted-foreground/60">/ 10GB</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="size-5" />
                                    <span>5</span>
                                    <span className="text-muted-foreground/60">/ 200</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Rocket className="size-5" />
                                    <span>212</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Orbit className="size-5" />
                                    <span>4</span>
                                </div>
                            </fieldset>
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Online Players
                                </legend>
                                <div className="grid gap-3">
                                    <ScrollArea className="h-full max-h-[200px] overflow-y-auto rounded-lg border">
                                        {players.map((player, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/50"
                                            >
                                                <div className="text-sm text-foreground">
                                                    {player.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {player.steamid}
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="relative flex h-full justify-between min-h-[80vh] max-h-[80vh] flex-col rounded-xl bg-muted/50 p-4 xl:col-span-2">
                        <Badge
                            variant="outline"
                            className="absolute right-3 top-3 bg-muted"
                        >
                            Output
                        </Badge>
                        <div className="mb-3 flex-1 rounded-lg bg-black max-h-full overflow-y-scroll ">
                            <div className="flex flex-col gap-0.5 p-1 font-mono">
                                {messages.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/50"
                                    >
                                        <div className="text-xs text-white">
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div className="text-sm text-white">{item.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                            x-chunk="dashboard-03-chunk-1"
                        >
                            <Label htmlFor="message" className="sr-only">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Run command..."
                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                            />
                            <div className="flex items-center gap-3 p-3 pt-0">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            type="button"
                                            onClick={() => setStatus(isStart ? "stopped" : "starting")}
                                        >
                                            <SquarePower className="size-5" />
                                            <span className="sr-only">Start/Stop</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Start/Stop</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            type="button"
                                            onClick={() => {
                                                setStatus("stopping")
                                                setTimeout(() => setStatus("starting"), 1000)
                                            }}
                                        >
                                            <RotateCcw className="size-5" />
                                            <span className="sr-only">Restart</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Restart</TooltipContent>
                                </Tooltip>
                                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                    Run Command
                                    <CornerDownLeft className="size-3.5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="col-span-2 xl:col-span-3">{/* <LineChart /> */}</div>
                </main>
            </div>
        </Main>
    )
}