
// Mock AI Analysis Engine for Offline Mode
export const generateMockInsight = (userId, date, db) => {
    // 1. Gather data for the day
    const logs = (db.workout_logs || []).filter(l => l.user_id === userId && l.scheduled_for === date);
    const nutrition = (db.daily_checklist_logs || []).filter(l => l.user_id === userId && l.scheduled_for === date && l.item_id.includes('nutr'));
    const supplements = (db.daily_checklist_logs || []).filter(l => l.user_id === userId && l.scheduled_for === date && l.item_id.includes('supp'));

    const completedEx = logs.length;
    const completedNutr = nutrition.filter(n => n.completed).length;
    
    // 2. Generate a contextual message
    let summary = "";

    if (completedEx === 0 && completedNutr === 0) {
        summary = "I see you haven't logged anything for today yet. Remember, consistency is key! Start with your first meal or a light walk.";
    } else if (completedEx > 0 && completedNutr > 0) {
        summary = `Great work today! You smashed ${completedEx} exercise sets and stayed on track with your nutrition. Your metabolic momentum is high. Keep hydrating!`;
    } else if (completedEx > 0) {
        summary = `Solid training session with ${completedEx} sets logged. Don't forget to check off your nutrition items to ensure proper recovery!`;
    } else {
        summary = `Nutrition is looking good! You've checked off ${completedNutr} items. Are we hitting the gym later, or is this a recovery day?`;
    }

    // Add specific mentions if data exists
    if (logs.some(l => l.intensity > 80)) {
        summary += " I noticed some high-intensity cardio - great for fat oxidation!";
    }

    return {
        summary,
        generated_at: new Date().toISOString()
    };
};
