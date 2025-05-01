import React from 'react';
import { ColorProvider } from './context/ColorContext';
import TakiGame from './TakiGame';

// Wrap the app with ColorProvider
export default function App() {
  return (
    <ColorProvider>
      <TakiGame />
    </ColorProvider>
  );
} 