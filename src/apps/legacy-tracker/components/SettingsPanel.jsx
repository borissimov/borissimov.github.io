import React, { useState, useEffect } from 'react';
import { usePlan } from '../../../context/PlanContext';
import { DataManager } from '../../../data/DataManager';
import { Bell, Clock, Trash, Info, Smartphone, AlertTriangle, Palette } from 'lucide-react';

export const SettingsPanel = () => {
    const { session, timerState, setTimerState } = usePlan();
    const [defaultRest, setDefaultRest] = useState(60);
    const [theme, setTheme] = useState('default');
    const [navMode, setNavMode] = useState('week');
    const [isDevMode, setIsDevMode] = useState(localStorage.getItem('mp_use_mock_db') === 'true');
    const [monitorStats, setMonitorStats] = useState({ requests: 0, egressBytes: 0, logs: [] });
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            DataManager.getProfile(session.user.id).then(p => {
                if (p?.theme_preference) setTheme(p.theme_preference);
                if (p?.navigation_mode) setNavMode(p.navigation_mode);
            });
        }
    }, [session]);

    // Poll Mock Stats
    useEffect(() => {
        if (!isDevMode) return;
        const loadStats = () => {
            try {
                const stats = JSON.parse(localStorage.getItem('mock_monitor_stats') || '{"requests":0,"egressBytes":0,"logs":[]}');
                setMonitorStats(stats);
            } catch (e) {}
        };
        loadStats();
        const interval = setInterval(loadStats, 1000);
        return () => clearInterval(interval);
    }, [isDevMode]);

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        if (session?.user?.id) {
            await DataManager.saveProfile(session.user.id, { theme_preference: newTheme });
        }
    };

    const handleNavChange = async (newMode) => {
        setNavMode(newMode);
        localStorage.setItem('mp_nav_mode', newMode); // Immediate local effect for App.jsx
        if (session?.user?.id) {
            await DataManager.saveProfile(session.user.id, { navigation_mode: newMode });
        }
        // Force reload to apply layout change cleanly? Or Context update.
        // For simplicity, reload or let App.jsx read from localStorage/Profile on mount.
        window.location.reload(); 
    };

    const handleDevToggle = () => {
        if (isDevMode) {
            // Switching to Online
            if(!confirm("Disable Offline Mode? App will reload and connect to Supabase.")) return;
            localStorage.setItem('mp_use_mock_db', 'false');
            sessionStorage.setItem('mp_is_temp_online', 'true');
        } else {
            // Switching to Offline
            if(!confirm("Enable Development Mode (Offline/Mock)? App will reload using local data only.")) return;
            localStorage.setItem('mp_use_mock_db', 'true');
            sessionStorage.removeItem('mp_is_temp_online');
        }
        window.location.reload();
    };

    const handleClearCache = () => {
        if(confirm("Are you sure? This will clear local logs and checkboxes. Cloud data is safe.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleTestNotification = () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Master Plan", { body: "Notifications are working!" });
                } else {
                    alert("Notifications blocked. Please enable them in browser settings.");
                }
            });
        }
    };

    return (
        <div className="pb-24 pt-4 px-4 text-white">
            <h2 className="section-title mb-6">Settings</h2>

            {/* Account */}
            <div className="card mb-6" style={{borderTop: '2px solid #555'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase">Account</div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">
                            {session?.user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold">{session?.user?.email}</div>
                            <div className="text-xs text-gray-500">User ID: {session?.user?.id?.substring(0, 8)}...</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Mode */}
            <div className="card mb-6" style={{borderTop: '2px solid #3498db'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Smartphone size={16} /> Connection Mode
                        </div>
                        <div 
                            className="px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider"
                            style={{
                                borderColor: isDevMode ? '#3498db' : '#2ecc71',
                                color: isDevMode ? '#3498db' : '#2ecc71'
                            }}
                        >
                            {isDevMode ? "OFFLINE" : "ONLINE"}
                        </div>
                    </div>
                    <div className="mt-4">
                        <button 
                            onClick={handleDevToggle}
                            className="action-btn w-full justify-center py-3"
                            style={{border: '1px solid #444', background: '#222'}}
                        >
                            Switch to {isDevMode ? "Online Mode" : "Offline Mode"}
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {isDevMode 
                                ? "Data is saved locally on this device only." 
                                : "Data is synced to the cloud."}
                        </p>
                        
                        {isDevMode && (
                            <div className="mt-4 p-3 bg-black rounded border border-gray-800 text-xs font-mono text-gray-400">
                                <div className="flex justify-between mb-1">
                                    <span>Requests:</span>
                                    <span className="text-white font-bold">{monitorStats.requests}</span>
                                </div>
                                <div className="flex justify-between mb-3">
                                    <span>Egress (Est):</span>
                                    <span className="text-white font-bold">{(monitorStats.egressBytes / 1024).toFixed(2)} KB</span>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setShowLogs(!showLogs)}
                                        className="action-btn flex-1 justify-center py-2"
                                    >
                                        {showLogs ? "Hide Logs" : "View Logs"}
                                    </button>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem('mock_db');
                                            window.location.reload(); 
                                        }}
                                        className="action-btn flex-1 justify-center py-2"
                                        style={{borderColor: '#e67e22', color: '#e67e22'}}
                                    >
                                        Reset Mock Data
                                    </button>
                                </div>

                                {showLogs && (
                                    <div className="mt-3 border-t border-gray-800 pt-2 h-40 overflow-y-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-gray-600">
                                                    <th>Type</th>
                                                    <th>Table</th>
                                                    <th className="text-right">Size</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(monitorStats.logs || []).map(log => (
                                                    <tr key={log.id} className="border-b border-gray-900">
                                                        <td className={`py-1 ${log.type === 'SELECT' ? 'text-blue-400' : 'text-orange-400'}`}>{log.type}</td>
                                                        <td className="py-1 text-gray-500">{log.table}</td>
                                                        <td className="py-1 text-right text-gray-300">{log.size}b</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="card mb-6" style={{borderTop: '2px solid #9b59b6'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase flex items-center gap-2">
                        <Palette size={16} /> Appearance
                    </div>
                    
                    <div className="mt-4">
                        <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Theme</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleThemeChange('default')}
                                className={`action-btn flex-1 justify-center ${theme === 'default' ? 'active-edit' : ''}`}
                                style={{border: theme === 'default' ? '1px solid #fff' : '1px solid #333'}}
                            >
                                Default
                            </button>
                            <button 
                                onClick={() => handleThemeChange('material-dark')}
                                className={`action-btn flex-1 justify-center ${theme === 'material-dark' ? 'active-edit' : ''}`}
                                style={{border: theme === 'material-dark' ? '1px solid #fff' : '1px solid #333'}}
                            >
                                Material
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Navigation Style</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleNavChange('week')}
                                className={`action-btn flex-1 justify-center ${navMode === 'week' ? 'active-edit' : ''}`}
                                style={{border: navMode === 'week' ? '1px solid #fff' : '1px solid #333'}}
                            >
                                Week Pager
                            </button>
                            <button 
                                onClick={() => handleNavChange('continuous')}
                                className={`action-btn flex-1 justify-center ${navMode === 'continuous' ? 'active-edit' : ''}`}
                                style={{border: navMode === 'continuous' ? '1px solid #fff' : '1px solid #333'}}
                            >
                                Continuous
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            "Week Pager" snaps one week at a time. "Continuous" lets you scroll seamlessly through days.
                        </p>
                    </div>
                </div>
            </div>

            {/* Timer */}
            <div className="card mb-6" style={{borderTop: '2px solid var(--training-accent)'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase flex items-center gap-2">
                        <Clock size={16} /> Timer Defaults
                    </div>
                    <div className="mt-4">
                        <label className="text-sm text-gray-300 block mb-2">Default Rest Interval (Seconds)</label>
                        <input 
                            type="number" 
                            className="dark-input" 
                            value={defaultRest} // Just a placeholder for now, usually driven by routine
                            onChange={(e) => setDefaultRest(e.target.value)}
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-2">Currently, rest times are defined by your specific routine day configuration.</p>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="card mb-6" style={{borderTop: '2px solid var(--supplements-accent)'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase flex items-center gap-2">
                        <Bell size={16} /> Notifications
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                        <button onClick={handleTestNotification} className="action-btn w-full justify-center py-3">
                            Test Local Notification
                        </button>
                        <p className="text-xs text-gray-500">
                            Push notifications are handled automatically when the timer runs in the background. Ensure your device is not in "Do Not Disturb" mode.
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="card mb-6" style={{borderTop: '2px solid #e74c3c'}}>
                <div className="card-content">
                    <div className="card-title text-sm text-gray-400 uppercase flex items-center gap-2">
                        <AlertTriangle size={16} color="#e74c3c" /> Danger Zone
                    </div>
                    <div className="mt-4">
                        <button onClick={handleClearCache} className="logout-btn" style={{color: '#e74c3c', border: '1px solid #333', borderRadius: '8px', justifyContent: 'center'}}>
                            <Trash size={16} /> Clear Local Cache
                        </button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Fixes display issues by resetting local storage. Your saved workout data is safe in the cloud.
                        </p>
                    </div>
                </div>
            </div>

             {/* About */}
             <div className="text-center mt-8 opacity-50">
                <div className="flex justify-center mb-2"><Info size={24} /></div>
                <h3 className="font-bold text-lg">Master Plan</h3>
                <p className="text-xs">Version 1.2.0 (PWA)</p>
                <p className="text-xs mt-1">Built with React + Vite + Supabase</p>
            </div>
        </div>
    );
};