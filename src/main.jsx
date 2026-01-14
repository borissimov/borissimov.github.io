import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { PlanProvider } from './context/PlanContext';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
        <PlanProvider>
            <App />
        </PlanProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
