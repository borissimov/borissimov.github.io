import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
import { DataManager } from '../data/DataManager';
import { RoutineEditor } from './RoutineEditor';
import { RoutineAssigner } from './RoutineAssigner';
import { CreateRoutineForm } from './planner/CreateRoutineForm';
import { RoutineCard } from './planner/RoutineCard';
import { Plus } from 'lucide-react';

export const PlannerPanel = () => {
    const { session } = usePlan();
    const [routines, setRoutines] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingRoutineId, setEditingRoutineId] = useState(null);
    const [assigningRoutine, setAssigningRoutine] = useState(null);

    const loadData = async () => {
        if (!session?.user?.id) return;
        setLoading(true);
        const [list, currentActive] = await Promise.all([
            DataManager.listRoutines(session.user.id),
            DataManager.getActiveRoutineId(session.user.id)
        ]);
        setRoutines(list);
        setActiveId(currentActive);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [session]);

    const handleAssignConfirm = async (id, start, end) => {
        await DataManager.activateRoutine(session.user.id, id, start, end);
        setActiveId(id);
        setAssigningRoutine(null);
        window.location.reload();
    };

    const handleCreate = async (name) => {
        const newRoutine = await DataManager.createRoutine(session.user.id, name);
        if (newRoutine) {
            setRoutines([...routines, newRoutine]);
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this routine?")) {
            await DataManager.deleteRoutine(id);
            setRoutines(routines.filter(r => r.id !== id));
        }
    };

    if (editingRoutineId) {
        return <RoutineEditor routineId={editingRoutineId} onClose={() => { setEditingRoutineId(null); loadData(); }} />;
    }

    if (assigningRoutine) {
        return <RoutineAssigner routine={assigningRoutine} onClose={() => setAssigningRoutine(null)} onAssign={handleAssignConfirm} />;
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading routines...</div>;

    return (
        <div className="p-4 pb-24 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="section-title mb-0">My Routines</h2>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="action-btn"
                    style={{ background: 'var(--training-accent)', color: '#000', border: 'none' }}
                >
                    <Plus size={16} /> New
                </button>
            </div>

            {isCreating && <CreateRoutineForm onCreate={handleCreate} onCancel={() => setIsCreating(false)} />}

            <div className="space-y-4">
                {routines.map(r => (
                    <RoutineCard 
                        key={r.id} 
                        r={r} 
                        activeId={activeId} 
                        onActivate={setAssigningRoutine}
                        onEdit={setEditingRoutineId}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};