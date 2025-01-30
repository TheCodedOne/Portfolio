import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "~/components/ui/sidebar";
import { ChevronRight, File, Folder } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

// This is sample data.
const data = {
    changes: [
        {
            file: "SpaceEngineers-Dedicated.cfg",
            state: "M",
        },
        {
            file: "Logs/SpaceEngineers_20240220.log",
            state: "U",
        },
    ],
    tree: [
        [
            "Config",

            "SpaceEngineers-Dedicated.cfg",
            "ServerConfig.xml",
            "Sandbox_config.sbc",

        ],
        [
            "Saves",
            [
                "Backup",
                ["LastSession_backup.sbl"],
                "LastSession.sbl",
                "Checkpoint.sbl",
            ],
        ],
        [
            "Mods",
            ["WorkshopMods.xml", "ModList.xml"],
            ["1234567", "mod.sbm"],
            ["7654321", "mod.sbm"],
        ],
        [
            "Logs",
            "SpaceEngineers_20240220.log",
            "SpaceEngineers_20240219.log",
        ],
        [
            "World",
            ["Sectors", ["0_0_0.vx2"],
                "Sandbox.sbc",
                "SANDBOX_0_0_0.sbs"],
        ],
        "SpaceEngineers-Dedicated.exe",
        "steam_appid.txt",
        "README.txt",
    ],
};

export const FilesSidebar = () => {
    return (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Changes</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.changes.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton className="w-5/6">
                                        <File />
                                        <span className="overflow-hidden text-ellipsis">{item.file}</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuBadge className="right-4">{item.state}</SidebarMenuBadge>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.tree.map((item, index) => (
                                <Tree key={index} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};


type ItemType = string | ItemType[]


function Tree({ item }: { item: ItemType }) {
    const [name, ...items]: ItemType[] = Array.isArray(item) ? item : [item]
    if (!items.length) {
        return (
            <SidebarMenuButton
                isActive={name === "button.tsx"}
                className="data-[active=true]:bg-transparent"
            >
                <File />
                {name}
            </SidebarMenuButton>
        )
    }
    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={name === "components" || name === "ui"}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        {name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}