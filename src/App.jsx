import React, { useState, useEffect } from 'react';
import { HubApp } from './apps/hub/HubApp';
import LegacyApp from './apps/legacy-tracker/App';
import { usePlan } from './context/PlanContext';

// Simple Router Component
const App = () => {
    // Starting point is always the Hub
    const [activeApp, setActiveApp] = useState('hub');

    const { session, loading } = usePlan();

    // Handle back to hub
    const exitToHub = () => setActiveApp('hub');

    if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black">Initializing Master Plan...</div>;

    // Render the selected application
    switch (activeApp) {
        case 'legacy':
            return <LegacyApp onExit={exitToHub} />;
        case 'bp':
            return (
                <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Blood Pressure Tracker</h2>
                    <p className="text-gray-500 mb-8">Feature Implementation Pending...</p>
                    <button onClick={exitToHub} className="px-6 py-2 bg-[#333] rounded-lg">Back to Hub</button>
                </div>
            );
        case 'regimen':
            return (
                <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Regimen Pro</h2>
                    <p className="text-gray-500 mb-8">Porting from HTML logic in progress...</p>
                    <button onClick={exitToHub} className="px-6 py-2 bg-[#333] rounded-lg">Back to Hub</button>
                </div>
            );
        case 'editor':
            return (
                <div className="flex flex-col h-screen bg-black text-white items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Routine Editor</h2>
                    <p className="text-gray-500 mb-8">Phase 3 Objective...</p>
                    <button onClick={exitToHub} className="px-6 py-2 bg-[#333] rounded-lg">Back to Hub</button>
                </div>
            );
        case 'hub':
        default:
            return <HubApp setActiveApp={setActiveApp} />;
    }
};

export default App;
