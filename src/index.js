import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js'; // Assuming you have an App component
import './index.css'; // Assuming you have an index.css file

const container = document.getElementById('root');
const root = createRoot(container); // Create a root for the React tree

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
