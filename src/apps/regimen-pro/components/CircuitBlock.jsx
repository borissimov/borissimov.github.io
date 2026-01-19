import React, { useState } from 'react';
import { ExerciseRow } from './ExerciseRow';
import { RefreshCcw, CheckCircle2 } from 'lucide-react';

export const CircuitBlock = ({ block }) => {
    const [currentRound, setCurrentRound] = useState(1);
    const totalRounds = 3; 
    
    const handleRoundComplete = () => {
        if (currentRound < totalRounds) {
            setCurrentRound(prev => prev + 1);
            // In a real app, we would scroll to the top of this block
        }
    };

    const isComplete = currentRound >= totalRounds && false; // Future completion logic

    return (
        <div style={{ padding: '0 0 12px 0' }}>
            {/* Header */}
            <div className="section-header" style={{ marginBottom: '16px' }}>
                <RefreshCcw size={14} /> {block.label || 'CIRCUIT'}
            </div>

            {/* Progress Indicator: 1 / 3 ROUNDS */}
            <div style={{ textAlign: 'center', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
                    {currentRound}
                </span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', opacity: 0.3 }}>/</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
                    {totalRounds}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginLeft: '4px' }}>
                    ROUNDS
                </span>
            </div>

            {/* Active Round Exercises */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {block.exercises.map((ex) => (
                    <ExerciseRow 
                        key={`${currentRound}-${ex.id}`}
                        exercise={ex}
                        roundNumber={currentRound}
                        onLog={() => {}}
                    />
                ))}
            </div>

            {/* Finish Round Action */}
            <button 
                onClick={handleRoundComplete}
                className="premium-btn-primary"
                style={{ marginTop: '20px', backgroundColor: '#f29b11', color: '#000' }}
            >
                {currentRound < totalRounds ? `Finish Round ${currentRound}` : 'Circuit Complete'}
            </button>
        </div>
    );
};