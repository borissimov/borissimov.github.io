import React from 'react';

export const SessionFooter = ({ onFinish, globalPercent }) => {
    const isComplete = globalPercent >= 100;
    
    return (
        <div style={{ padding: '20px 15px 60px' }}>
            <button 
                className={isComplete ? "premium-btn-primary animate-pulse-bright-green" : "premium-btn-primary"} 
                style={{ 
                    backgroundColor: isComplete ? '#2ecc71' : 'transparent', 
                    border: isComplete ? 'none' : `2px solid #f29b11`, 
                    color: isComplete ? '#000' : '#f29b11', 
                    boxShadow: isComplete ? '0 0 30px rgba(46, 204, 113, 0.4)' : '0 4px 20px rgba(0,0,0,0.5)', 
                    fontWeight: '900', 
                    fontSize: '16px', 
                    height: '54px' 
                }} 
                onClick={onFinish}
            >
                {isComplete ? 'COMPLETED • END ACTIVITY' : 'End activity'}
            </button>
        </div>
    );
};
