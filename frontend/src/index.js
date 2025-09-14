import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HeroUIProvider } from "@heroui/react";
import {AuthContextProvider} from './context/AuthContext'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </HeroUIProvider>
  </React.StrictMode>
);

