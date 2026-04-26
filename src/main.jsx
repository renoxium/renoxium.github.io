import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initCursor } from './cursor.js';
import './styles.css';

initCursor();
createRoot(document.getElementById('root')).render(<App />);
