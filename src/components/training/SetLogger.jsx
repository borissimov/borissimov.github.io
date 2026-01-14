import React, { useState } from 'react';

export const SetLogger = ({ onLog, defaultWeight, defaultReps, defaultRpe, type = 'Resistance' }) => {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState("");
    const [tempo, setTempo] = useState("");
    const [duration, setDuration] = useState("");

    const handleLog = () => {
        const finalWeight = weight || defaultWeight || (type === 'Cardio' ? '-' : "BW");
        const finalReps = reps || defaultReps || (type === 'Cardio' ? '1' : "0"); 
        
        // Split RPE vs Intensity
        const inputVal = rpe; // State variable reused for both
        const finalRpe = !isCardio ? (inputVal || defaultRpe || "-") : null;
        const finalIntensity = isCardio ? (inputVal || "-") : null;

        // onLog(weight, reps, rpe, tempo, duration, intensity)
        onLog(finalWeight, finalReps, finalRpe, tempo, duration, finalIntensity);
        
        setWeight(""); setReps(""); setRpe(""); setTempo(""); setDuration("");
    };

    const isCardio = type === 'Cardio';

    return (
        <div className="set-logger">
            <div className="set-inputs">
                {!isCardio && (
                    <>
                        <input type="text" placeholder="Kg" className="set-input" value={weight} onChange={e => setWeight(e.target.value)} style={{width: '20%'}} />
                        <input type="number" placeholder="Reps" className="set-input" value={reps} onChange={e => setReps(e.target.value)} style={{width: '20%'}} />
                    </>
                )}
                
                {isCardio && (
                    <input type="number" placeholder="Mins" className="set-input" value={duration} onChange={e => setDuration(e.target.value)} style={{width: '40%'}} />
                )}

                <input type="number" placeholder={isCardio ? "Int %" : "RPE"} className="set-input" value={rpe} onChange={e => setRpe(e.target.value)} style={{width: '20%'}} />
                
                {!isCardio && (
                    <input type="text" placeholder="Tempo" className="set-input" value={tempo} onChange={e => setTempo(e.target.value)} style={{width: '20%'}} />
                )}
                
                <button onClick={handleLog} style={{width: '20%'}}>LOG</button>
            </div>
        </div>
    );
};
