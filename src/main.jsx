import React from 'react';
import { createRoot } from 'react-dom/client';
import SemesterTracker from '../semester-tracker.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SemesterTracker />
  </React.StrictMode>
);
