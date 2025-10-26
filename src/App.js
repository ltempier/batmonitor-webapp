import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { LayoutDashboardIcon } from 'lucide-react';
import { Separator } from './components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './components/ui/sidebar';
import { AppProvider } from './context/AppContext';


import RealTime from './components/RealTime';
import Historic from './components/Historic';

// Temporary components for undefined routes
const Battery = () => <div>Battery Dashboard Page</div>;
const Wifi = () => <div>Wifi Settings Page</div>;
const Status = () => <div>Status Page</div>;
const Logs = () => <div>Logs Page</div>;
const Home = () => <div>Home Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

// Menu data
const menu = [
  {
    displayName: 'Dashboards',
    path: '/', // Default to first submenu item
    element: <RealTime />,
    subMenu: [
      { displayName: 'Real Time', path: '/realtime', element: <RealTime /> },
      { displayName: 'Historic Data', path: '/historic', element: <Historic /> },
      { displayName: 'Battery Dashboard', path: '/battery', element: <Battery /> },
    ],
  },
  {
    displayName: 'ESP32 Settings',
    // path: '/status', // Default to first submenu item
    // element: <Status />,
    subMenu: [
      { displayName: 'Wifi', path: '/wifi', element: <Wifi /> },
      { displayName: 'Status', path: '/status', element: <Status /> },
      { displayName: 'Logs', path: '/logs', element: <Logs /> },
    ],
  },
];

function App() {
  return (
    <AppProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link to="/">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <LayoutDashboardIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">ESP32</span>
                      <span className="truncate text-xs">Dashboard</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {menu.map((group, index) => (
              <SidebarGroup key={`SidebarGroup_${index}`}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <span className="p-2">
                        {group.displayName}
                      </span>
                    </SidebarMenuItem>
                    {group.subMenu && (
                      <SidebarMenuSub>
                        {group.subMenu.map((item, subIdx) => (
                          <SidebarMenuSubItem key={`SidebarMenuSubItem_${index}_${subIdx}`}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={item.path}>{item.displayName}</NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="m-3 rounded-lg">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <Separator orientation="horizontal" className="mr-2" />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Routes>
              {/* Dynamically generate routes from menu */}
              {menu.flatMap((group, index) =>
                [
                  group.path && group.element && (
                    <Route
                      key={`Route_${index}`}
                      path={group.path}
                      element={group.element}
                    />
                  ),
                  ...(group.subMenu?.map((item, subIdx) => (
                    <Route
                      key={`Route_${index}_${subIdx}`}
                      path={item.path}
                      element={item.element}
                    />
                  )) || []),
                ].filter(Boolean) // Remove falsy values (e.g., undefined subMenu)
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}

export default App;