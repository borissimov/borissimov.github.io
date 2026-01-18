import React, { useState, useEffect } from 'react';
import { usePlan } from '../../../context/PlanContext';
import { DataManager } from '../../../data/DataManager';
import { User, Save, Scale, CalendarDays } from 'lucide-react';

export const ProfilePanel = () => {
    const { session, refreshProfile } = usePlan();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        weight: ''
    });

    useEffect(() => {
        if (session?.user?.id) {
            DataManager.getProfile(session.user.id).then(data => {
                if (data) {
                    setFormData({
                        full_name: data.full_name || '',
                        age: data.age || '',
                        weight: data.weight || ''
                    });
                }
                setLoading(false);
            });
        }
    }, [session]);

    const handleSave = async () => {
        setSaving(true);
        await DataManager.saveProfile(session.user.id, formData);
        await refreshProfile(session.user.id);
        setSaving(false);
        // Optional: Show toast or feedback
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

    return (
        <div className="pb-24 pt-4 px-4 text-white">
            <h2 className="section-title mb-6">Profile Setup</h2>

            <div className="card mb-6">
                <div className="card-content">
                    <div className="flex flex-col gap-4">
                        
                        {/* Name */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    className="auth-input pl-10" 
                                    placeholder="Enter your name"
                                    value={formData.full_name}
                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Age</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input 
                                    type="number" 
                                    className="auth-input pl-10" 
                                    placeholder="Years"
                                    value={formData.age}
                                    onChange={e => setFormData({...formData, age: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Weight (kg)</label>
                            <div className="relative">
                                <Scale className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input 
                                    type="number" 
                                    className="auth-input pl-10" 
                                    placeholder="Kg"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={e => setFormData({...formData, weight: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className={`auth-button flex items-center justify-center gap-2 ${saving ? 'opacity-70' : ''}`}
                        >
                            {saving ? 'Saving...' : <><Save size={18} /> Save Profile</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 text-xs">
                <p>These details help tailor your master plan.</p>
                <p>Email: {session?.user?.email}</p>
            </div>
        </div>
    );
};
