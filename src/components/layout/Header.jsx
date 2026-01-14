import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { Menu, LogOut, Layout, Calendar, Settings, User } from 'lucide-react';
import { COLORS } from '../../constants/theme';

export const Header = ({ viewMode, setViewMode, activeTab, setActiveTab }) => {
    const { session, logout, profile, resetToToday } = usePlan();
    const [showSideMenu, setShowSideMenu] = useState(false);

    return (
        <div className="app-header">
            <div className="header-content" style={{ paddingBottom: '8px' }}>
                <div className="header-top-row">
                    <div className="filter-tabs" style={{ flex: 1, marginBottom: 0 }}>
                    {viewMode === 'tracker' ? (
                        ['training', 'nutrition', 'supplements', 'data'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`filter-btn active ${tab} ${activeTab === tab ? '' : 'opacity-50'}`} 
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))
                    ) : (
                        <div className="text-sm font-bold text-gray-400 py-1 uppercase tracking-wider">
                            {viewMode === 'planner' ? 'Planner Mode' : viewMode === 'settings' ? 'Settings' : 'Profile'}
                        </div>
                    )}
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowSideMenu(!showSideMenu)}
                            className="profile-btn"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {showSideMenu && (
                            <div className="profile-menu">
                                {/* Profile Button Header */}
                                <div className="profile-info" style={{padding: '0'}}>
                                    <button
                                        onClick={() => { setViewMode('profile'); setShowSideMenu(false); }}
                                        className="logout-btn"
                                        style={{ color: '#fff', borderBottom: '1px solid #333' }}
                                    >
                                        <User size={16} className="mr-2 text-gray-400" />
                                        <span className="text-xs truncate">{profile?.full_name || session?.user?.email}</span>
                                    </button>
                                </div>
                                
                                <div className="py-2 border-bottom border-[#333]">
                                    <button 
                                        onClick={() => { setViewMode('tracker'); resetToToday(); setShowSideMenu(false); }}
                                        className={`logout-btn ${viewMode === 'tracker' ? 'bg-[#222]' : ''}`}
                                        style={{ color: 'var(--training-accent)' }}
                                    >
                                        <Layout size={16} /> Tracker
                                    </button>
                                    <button 
                                        onClick={() => { setViewMode('planner'); setShowSideMenu(false); }}
                                        className={`logout-btn ${viewMode === 'planner' ? 'bg-[#222]' : ''}`}
                                        style={{ color: 'var(--nutrition-accent)' }}
                                    >
                                        <Calendar size={16} /> Planner
                                    </button>
                                    <button 
                                        onClick={() => { setViewMode('settings'); setShowSideMenu(false); }}
                                        className={`logout-btn ${viewMode === 'settings' ? 'bg-[#222]' : ''}`}
                                        style={{ color: '#ccc' }}
                                    >
                                        <Settings size={16} /> Settings
                                    </button>
                                </div>

                                <button 
                                    onClick={() => { logout(); setShowSideMenu(false); }}
                                    className="logout-btn"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
