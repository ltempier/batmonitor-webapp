import React from "react";

import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    LayoutDashboardIcon
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "~/components/ui/sidebar";


export function AppSidebar({setCurrentPage, ...props}) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <span>
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <LayoutDashboardIcon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">ESP32</span>
                                    <span className="truncate text-xs">Dashboard</span>
                                </div>
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span className="font-medium">Dashboards</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("realtime")}>
                                    <a href="#realtime">Real Time</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("historic")}>
                                    <a href="#historic">Historic data</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>


                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("battery")}>
                                    <a href="#battery">Battery Dashboard</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <span className="font-medium">ESP32 Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("wifi")}>
                                    <a href="#wifi">Wifi</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("status")}>
                                    <a href="#status">Status</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild onClick={() => setCurrentPage("logs")}>
                                    <a href="#logs">Logs</a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>


                        </SidebarMenuSub>
                    </SidebarMenu>
                </SidebarGroup>



            </SidebarContent>

            {/* <SidebarRail /> */}
        </Sidebar>
    );
}