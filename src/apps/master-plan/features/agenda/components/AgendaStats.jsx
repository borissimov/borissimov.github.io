import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Plus } from 'lucide-react';

export const AgendaStats = ({ stats, onLogActivity }) => {
    return (
        <motion.div 
            drag 
            dragMomentum={false} 
            dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
            dragElastic={0.05}
            style={{ position: 'absolute', bottom: '30px', right: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1000, touchAction: 'none' }}
        >
            <div style={{ backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', border: '1px solid #222', borderRadius: '20px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Flame size={14} color="#f29b11" fill="#f29b11" />
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{stats.streak}</span>
                </div>
                <div style={{ width: '1px', height: '12px', backgroundColor: '#333' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Target size={14} color="#2ecc71" />
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{stats.weekCount}</span>
                </div>
            </div>
            <button 
                onClick={onLogActivity} 
                style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f29b11', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(242, 155, 17, 0.5)', border: 'none' }}
            >
                <Plus size={36} strokeWidth={3} />
            </button>
        </motion.div>
    );
};