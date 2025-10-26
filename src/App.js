import React, { useContext, useState, useEffect, useRef } from 'react';


import { Separator } from './components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"


import { useApp, AppProvider } from './context/AppContext';

import RealTime from './components/RealTime';
import { AppSidebar } from "./components/AppSidebar"

function App() {

  const [currentPage, setCurrentPage] = useState("realtime");

  const menu = [
    {
      displayName: 'Dashboards',
      subMenue: [
        {
          displayName: 'Real Time',
          id: 'realtime',
          render: <RealTime />
        },
        {
          displayName: 'Historic data',
          id: 'historic'
        },
      ]
    },
    {
      displayName: 'ESP32 Settings',
      subMenue: [
        {

          displayName: 'Wifi',
          id: 'wifi'
        }
      ]
    },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "realtime":
        return <RealTime />;
      // case "historic":
      //   return <HistoricData />;
      // case "battery":
      //   return <BatteryDashboard />;
      default:
        return <RealTime />;
    }
  };


  return (
    <SidebarProvider >

      <AppSidebar className="m-3" setCurrentPage={setCurrentPage} />

      <SidebarInset className="m-3 rounded-lg">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
        </header>

        <Separator
          orientation="horizontal"
          className="mr-2"

        />

        <div className="flex flex-1 flex-col gap-4 p-4 ">
          {renderPage()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;