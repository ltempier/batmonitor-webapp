import React, { useContext, useEffect, useRef } from 'react';
import { IconRefresh, IconSun, IconMoon } from '@tabler/icons-react';

import { useApp, AppProvider } from './context/AppContext';

import { useTheme } from './context/ThemeContext';

import RealTime from './components/RealTime';
import { Button } from './components/ui/button';


function App() {

  const { theme, toggleTheme } = useTheme();
  return (
    <div className="App max-w-7xl mx-auto p-4">

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