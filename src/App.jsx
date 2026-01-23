import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { HubApp } from './apps/hub/HubApp';
import { LoginPortal } from './apps/hub/LoginPortal';
import MasterPlanApp from './apps/master-plan/MasterPlanApp';
import BloodPressureApp from './apps/blood-pressure/BloodPressureApp';
import { Loader2 } from 'lucide-react';

const PERSISTENCE_KEY = 'mp-app-navigation-v1';

const App = () => {
    const { session, loading } = useAuth();
    
    // LOAD SAVED STATE OR DEFAULT TO REGIMEN
    const getInitialState = () => {
        const saved = localStorage.getItem(PERSISTENCE_KEY);
        if (saved) return JSON.parse(saved);
        return { appId: 'regimen', view: null }; // Default to Training App during construction
    };

    const initialState = getInitialState();
    const [activeApp, setActiveApp] = useState(initialState.appId);
    const [historyState, setHistoryState] = useState(initialState);
    const [backPressCount, setBackPressCount] = useState(0);
    const [exitNotice, setExitNotice] = useState(false);

    // Unified Navigation function
    const navigate = useCallback((appId, view = null) => {
        const newState = { appId, view };
        window.history.pushState(newState, '', '');
        setActiveApp(appId);
        setHistoryState(newState);
        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(newState));
    }, []);

    useEffect(() => {
        if (!window.history.state) {
            window.history.replaceState(historyState, '', '');
        }

        const handlePopState = (event) => {
            const state = event.state;
            if (state && state.appId) {
                // Hub Exit Logic
                if (activeApp === 'hub' && state.appId === 'hub') {
                    setBackPressCount(prev => {
                        const next = prev + 1;
                        if (next >= 3) {
                            window.history.back(); 
                            return next;
                        }
                        setExitNotice(true);
                        setTimeout(() => { setExitNotice(false); setBackPressCount(0); }, 3000);
                        window.history.pushState({ appId: 'hub' }, '', '');
                        return next;
                    });
                } else {
                    // Normal Navigation Sync
                    setActiveApp(state.appId);
                    setHistoryState(state);
                    setBackPressCount(0);
                    setExitNotice(false);
                    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
                }
            } else {
                setActiveApp('hub');
                setHistoryState({ appId: 'hub' });
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeApp, historyState]);

    const exitToHub = () => navigate('hub');

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" color="#f29b11" size={40} />
            </div>
        );
    }

    if (!session) {
        return <LoginPortal />;
    }

    return (
        <>
            {exitNotice && (
                <div style={{
                    position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px 20px',
                    borderRadius: '20px', border: '1px solid #f29b11', zIndex: 9999,
                    fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                    Press {3 - backPressCount} more times to exit
                </div>
            )}

            {activeApp === 'bp' && <BloodPressureApp onExit={exitToHub} />}
            {activeApp === 'regimen' && (
                <MasterPlanApp 
                    onExit={exitToHub} 
                    currentView={historyState?.view} 
                    onNavigate={(view) => navigate('regimen', view)} 
                />
            )}
            {activeApp === 'hub' && <HubApp setActiveApp={(id) => navigate(id)} />}
        </>
    );
};

export default App;