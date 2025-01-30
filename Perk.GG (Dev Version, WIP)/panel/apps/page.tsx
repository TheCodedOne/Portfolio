"use client"

import {
    ArrowDownAZ,
    ArrowUpAZ,
    CheckCircle,
    Settings,
    XCircle,
} from 'lucide-react'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react'
import { DiscordConfigModal } from "~/components/integrations/discord-config-modal"
import { Main } from '~/components/layout/MainLayout'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const appText = new Map<string, string>([
    ['all', 'All Apps'],
    ['connected', 'Connected'],
    ['notConnected', 'Not Connected'],
])

export default function Apps() {
    const [sort, setSort] = useState('ascending')
    const [appType, setAppType] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAvailableOnly, setShowAvailableOnly] = useState(false)
    const [showDiscordConfig, setShowDiscordConfig] = useState(false)

    const searchParams = useSearchParams()

    const { data: connectedIntegrations } = api.integrations.list.useQuery()

    const filteredApps = (connectedIntegrations ?? [])
        .sort((a, b) => {
            // First sort by availability
            if (a.available !== b.available) {
                return a.available ? -1 : 1 // Available apps come first
            }
            // Then sort by name according to sort direction
            return sort === 'ascending'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        })
        .filter((app) =>
            appType === 'connected' ? app.isConnected : appType === 'notConnected' ? !app.isConnected : true
        )
        .filter((app) => !showAvailableOnly || app.available)
        .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const hasAnyUnavailable = connectedIntegrations?.some((app) => !app.available) ?? false

    const { mutate: connect } = api.integrations.connect.useMutation()
    const { mutate: disconnect } = api.integrations.disconnect.useMutation()
    const { data: authUrl } = api.integrations.getAuthUrl.useQuery({ type: "discord" }  )
    const { mutate: updateConfig } = api.integrations.updateConfig.useMutation({
        onSuccess: () => {
            // Optionally invalidate queries or show success message
        },
    })

    // Show config modal if redirected from OAuth with configure=discord
    useEffect(() => {
        if (searchParams?.get("configure") === "discord") {
            setShowDiscordConfig(true)
        }
    }, [searchParams])

    const success = searchParams?.get("success")
    const error = searchParams?.get("error")

    const handleConnect = async (type: "discord") => {
        if (authUrl) {
            window.location.href = authUrl
        }
    }

    const handleDisconnect = async (type: "discord") => {
        disconnect({ type })
    }

    const handleSaveDiscordConfig = async (config: { guildId: string }) => {
        updateConfig({
            type: "discord",
            config: {
                enabled: true,
                settings: config
            }
        })
    }

    return (
        <>
            <Main>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        App Integrations
                    </h1>
                    <p className='text-muted-foreground'>
                        Here&apos;s a list of your apps for the integration!
                    </p>
                    {success && (
                        <div className="mt-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Integration connected successfully!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        Failed to connect integration. Please try again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
                    <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
                        <Input
                            placeholder='Filter apps...'
                            className='h-9 w-40 lg:w-[250px]'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select value={appType} onValueChange={setAppType}>
                            <SelectTrigger className='w-36'>
                                <SelectValue>{appText.get(appType)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Apps</SelectItem>
                                <SelectItem value='connected'>Connected</SelectItem>
                                <SelectItem value='notConnected'>Not Connected</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasAnyUnavailable && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="available-only"
                                    checked={showAvailableOnly}
                                    onCheckedChange={(state) => setShowAvailableOnly(state == true)}
                                />
                                <label
                                    htmlFor="available-only"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show only available apps
                                </label>
                            </div>
                        )}
                    </div>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className='w-16'>
                            <SelectValue>
                                <Settings size={18} />
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent align='end'>
                            <SelectItem value='ascending'>
                                <div className='flex items-center gap-4'>
                                    <ArrowUpAZ size={16} />
                                    <span>Ascending</span>
                                </div>
                            </SelectItem>
                            <SelectItem value='descending'>
                                <div className='flex items-center gap-4'>
                                    <ArrowDownAZ size={16} />
                                    <span>Descending</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator className='shadow' />
                <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredApps.map((app) => {
                        return (
                            <li
                                key={app.id}
                                className='rounded-lg border p-4 hover:shadow-md bg-card'
                            >
                                <div className='mb-8 flex items-center justify-between'>
                                    <div
                                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                                    >
                                        {app.logo}
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        disabled={!app.available}
                                        onClick={() => app.isConnected ? handleDisconnect("discord") : handleConnect("discord")}
                                        className={cn(
                                            app.available && app.isConnected && 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900',
                                            !app.available && 'cursor-not-allowed opacity-50'
                                        )}
                                    >
                                        {!app.available ? 'Coming Soon' : app.isConnected ? 'Connected' : 'Connect'}
                                    </Button>
                                </div>
                                <div>
                                    <h2 className='mb-1 font-semibold'>{app.name}</h2>
                                    <p className='line-clamp-2 text-gray-500'>{app.description}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </Main>
            <DiscordConfigModal
                open={showDiscordConfig}
                onClose={() => setShowDiscordConfig(false)}
                onSave={handleSaveDiscordConfig}
            />
        </>
    )
}