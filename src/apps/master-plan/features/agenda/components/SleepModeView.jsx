import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SleepModeView = ({ elapsed, onWakeUp }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
                position: 'fixed', 
                inset: 0, 
                backgroundColor: '#000', 
                zIndex: 9999, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            <div style={{ position: 'absolute', top: '20%', opacity: 0.1 }}>
                <Moon size={120} color="#3b82f6" fill="#3b82f6" />
            </div>

            <div style={{ zIndex: 10 }}>
                <p style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px' }}>
                    RECOVERY ACTIVE
                </p>
                
                <h1 style={{ fontSize: '64px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                    {elapsed}
                </h1>

                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWakeUp();
                    }}
                    style={{ 
                        all: 'unset', 
                        marginTop: '60px', 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid #3b82f6', 
                        color: '#3b82f6', 
                        padding: '16px 40px', 
                        borderRadius: '30px', 
                        fontSize: '14px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        position: 'relative',
                        zIndex: 100
                    }}
                >
                    <Sun size={18} /> WAKE UP
                </motion.button>
            </div>

            <p style={{ position: 'absolute', bottom: '40px', fontSize: '10px', color: '#333', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
                SYSTEM IS IN LOW POWER MODE
            </p>
        </motion.div>
    );
};
