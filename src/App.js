import React, { useContext, useEffect, useRef } from 'react';


import { Button } from './components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"


import { useApp, AppProvider } from './context/AppContext';

import RealTime from './components/RealTime';



function App() {

  return (
    <div className="App max-w-7xl mx-auto p-4 dark">

      {/* <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
      >
        {theme === 'light' ? (
          <IconMoon className="h-4 w-4" />
        ) : (
          <IconSun className="h-4 w-4" />
        )}
      </Button> */}

      <AppProvider>
        <RealTime />
      </AppProvider>

    </div>
  );
}

export default App;