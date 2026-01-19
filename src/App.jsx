import React, { useState } from 'react';
import { HubApp } from './apps/hub/HubApp';
import LegacyApp from './apps/legacy-tracker/App';
import RegimenProApp from './apps/regimen-pro/RegimenProApp';
import BloodPressureApp from './apps/blood-pressure/BloodPressureApp';

const App = () => {
    const [activeApp, setActiveApp] = useState('hub');
    const exitToHub = () => setActiveApp('hub');

    switch (activeApp) {
        case 'legacy':
            return <LegacyApp onExit={exitToHub} />;
        case 'bp':
            return <BloodPressureApp onExit={exitToHub} />;
        case 'regimen':
            return <RegimenProApp onExit={exitToHub} />;
        case 'hub':
        default:
            return <HubApp setActiveApp={setActiveApp} />;
    }
};

export default App;