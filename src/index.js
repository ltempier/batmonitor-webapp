import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);