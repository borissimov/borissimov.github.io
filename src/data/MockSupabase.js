import { generateMockInsight } from './MockAI';

// Mock Supabase Client for Offline Development
// ... (Monitor logic same) ...


const loadDB = () => JSON.parse(localStorage.getItem('mock_db') || '{}');
const saveDB = (db) => localStorage.setItem('mock_db', JSON.stringify(db));

// Monitoring Tool
const MockMonitor = {
    requests: 0,
    egressBytes: 0,
    
    logRequest(type, table, data) {
        const size = new Blob([JSON.stringify(data)]).size;
        this.requests++;
        this.egressBytes += size;
        
        // Update stats in localStorage
        const stats = JSON.parse(localStorage.getItem('mock_monitor_stats') || '{"requests":0, "egressBytes":0, "logs":[], "breakdown":{}}');
        
        stats.requests = (stats.requests || 0) + 1;
        stats.egressBytes = (stats.egressBytes || 0) + size;
        
        // Logs (FIFO 50)
        stats.logs = [{
            id: stats.requests,
            timestamp: new Date().toISOString(),
            type,
            table,
            size
        }, ...(stats.logs || [])].slice(0, 50);
        
        // Aggregated Breakdown
        if (!stats.breakdown) stats.breakdown = {};
        const key = `${type} ${table}`;
        if (!stats.breakdown[key]) stats.breakdown[key] = { count: 0, size: 0 };
        stats.breakdown[key].count++;
        stats.breakdown[key].size += size;
        
        localStorage.setItem('mock_monitor_stats', JSON.stringify(stats));
    }
};

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this.db = loadDB();
        this.data = this.db[table] || [];
        this.filters = [];
        this.orders = [];
        this.limitVal = null;
        this.isSingle = false;
        
        // Mutation State
        this.mutation = null; // { type: 'INSERT'|'UPSERT'|'UPDATE'|'DELETE', data: ... }
        this.shouldSelect = false; // If .select() is called
    }

    select(columns) { 
        this.shouldSelect = true;
        return this; 
    }

    eq(column, value) {
        this.filters.push(row => row[column] === value);
        return this;
    }
    lte(column, value) {
        this.filters.push(row => row[column] <= value);
        return this;
    }
    gte(column, value) {
        this.filters.push(row => row[column] >= value);
        return this;
    }
    ilike(column, value) {
        const regex = new RegExp(value.replace(/%/g, '.*'), 'i');
        this.filters.push(row => regex.test(row[column]));
        return this;
    }
    or(query) { return this; }

    order(column, { ascending = true } = {}) {
        this.orders.push({ column, ascending });
        return this;
    }

    limit(n) {
        this.limitVal = n;
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }
    maybeSingle() {
        this.isSingle = true;
        return this;
    }

    // Mutations - Chainable
    insert(row) {
        this.mutation = { type: 'INSERT', data: row };
        return this;
    }
    
    upsert(row, options) {
        this.mutation = { type: 'UPSERT', data: row };
        return this;
    }
    
    update(updates) {
        this.mutation = { type: 'UPDATE', data: updates };
        return this;
    }
    
    delete() {
        this.mutation = { type: 'DELETE' };
        return this;
    }

    // Execute (Promise)
    async then(resolve, reject) {
        // Latency Sim
        await new Promise(r => setTimeout(r, 50)); 

        // Reload DB to get latest state
        this.db = loadDB();
        this.data = this.db[this.table] || [];

        let resultData = null;

        // Handle Mutations
        if (this.mutation) {
            const { type, data } = this.mutation;
            
            if (type === 'INSERT') {
                const newRow = { ...data, id: data.id || crypto.randomUUID(), created_at: new Date().toISOString() };
                if (!this.db[this.table]) this.db[this.table] = [];
                this.db[this.table].push(newRow);
                resultData = [newRow];
                MockMonitor.logRequest('INSERT', this.table, newRow);
            }
            else if (type === 'UPSERT') {
                if (!this.db[this.table]) this.db[this.table] = [];
                // Simple upsert based on ID or composite keys heuristic
                const idx = this.db[this.table].findIndex(r => {
                    if (data.id && r.id === data.id) return true;
                    // Custom check for daily_exercise_status (composite key)
                    if (this.table === 'daily_exercise_status' && r.user_id === data.user_id && r.date === data.date && r.exercise_index === data.exercise_index) return true;
                    // Custom check for daily_checklist_logs
                    if (this.table === 'daily_checklist_logs' && r.user_id === data.user_id && r.item_id === data.item_id && r.scheduled_for === data.scheduled_for) return true;
                    // Custom check for user_routine_status
                    if (this.table === 'user_routine_status' && r.user_id === data.user_id && r.active_routine_id === data.active_routine_id) return true;
                    // Custom check for profiles
                    if (this.table === 'profiles' && r.id === data.id) return true;
                    return false;
                });
                
                if (idx >= 0) {
                    this.db[this.table][idx] = { ...this.db[this.table][idx], ...data };
                    resultData = [this.db[this.table][idx]];
                } else {
                    const newRow = { ...data, id: data.id || crypto.randomUUID() };
                    this.db[this.table].push(newRow);
                    resultData = [newRow];
                }
                MockMonitor.logRequest('UPSERT', this.table, data);
            }
            else if (type === 'UPDATE') {
                // Apply filters to find rows to update
                this.db[this.table] = this.db[this.table].map(row => {
                    if (this.filters.every(f => f(row))) {
                        return { ...row, ...data };
                    }
                    return row;
                });
                resultData = null; // Update usually returns null unless select
                MockMonitor.logRequest('UPDATE', this.table, data);
            }
            else if (type === 'DELETE') {
                this.db[this.table] = this.db[this.table].filter(row => !this.filters.every(f => f(row)));
                resultData = null;
                MockMonitor.logRequest('DELETE', this.table, {});
            }
            
            saveDB(this.db);
            
            // If select() was called, return the modified data
            if (this.shouldSelect) {
                // For insert/upsert, resultData is already set.
                // For update, we might need to fetch what we updated? (Complex, skip for now)
                if (resultData && this.isSingle) {
                    resolve({ data: resultData[0], error: null });
                } else {
                    resolve({ data: resultData, error: null });
                }
                return;
            }
            
            resolve({ data: null, error: null });
            return;
        }

        // READ Logic
        let result = this.data.filter(row => this.filters.every(f => f(row)));

        if (this.orders.length > 0) {
            result.sort((a, b) => {
                for (const o of this.orders) {
                    if (a[o.column] < b[o.column]) return o.ascending ? -1 : 1;
                    if (a[o.column] > b[o.column]) return o.ascending ? 1 : -1;
                }
                return 0;
            });
        }

        if (this.limitVal) {
            result = result.slice(0, this.limitVal);
        }

        let dataToReturn;
        if (this.isSingle) {
            dataToReturn = result.length > 0 ? result[0] : null;
        } else {
            dataToReturn = result;
        }

        MockMonitor.logRequest('SELECT', this.table, dataToReturn || {});
        resolve({ data: dataToReturn, error: null });
    }
}

// Auth State Management
let authListeners = [];
const notifyAuthListeners = (event, session) => {
    authListeners.forEach(callback => callback(event, session));
};

export const mockSupabase = {
    from: (table) => new QueryBuilder(table),
    auth: {
        getSession: async () => {
            const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
            // If explicit session is null, return null (logged out).
            // However, for dev convenience, if NEVER set, we might default to logged in? 
            // Better to stick to standard behavior: If no session, user must log in.
            // But since previous mock was "always logged in", existing users might be confused if they are suddenly logged out.
            // Let's check if 'mock_session' key exists at all.
            if (localStorage.getItem('mock_session') === null) {
                 // First time load: Default to logged in for convenience
                 const defaultSession = { user: { id: 'mock-user-id', email: 'test@local.com' } };
                 localStorage.setItem('mock_session', JSON.stringify(defaultSession));
                 return { data: { session: defaultSession } };
            }
            return { data: { session } };
        },
        onAuthStateChange: (callback) => {
            authListeners.push(callback);
            // Immediately fire with current state? Standard Supabase doesn't always do this on subscription, 
            // but usually 'getSession' covers the initial load.
            return { data: { subscription: { unsubscribe: () => {
                authListeners = authListeners.filter(l => l !== callback);
            } } } };
        },
        signInWithPassword: async ({ email }) => {
            const user = { id: 'mock-user-id', email };
            const session = { user, access_token: 'mock-token', refresh_token: 'mock-refresh' };
            localStorage.setItem('mock_session', JSON.stringify(session));
            notifyAuthListeners('SIGNED_IN', session);
            return { data: { user, session }, error: null };
        },
        signUp: async ({ email }) => {
            const user = { id: 'mock-user-id', email };
            const session = { user, access_token: 'mock-token', refresh_token: 'mock-refresh' };
            localStorage.setItem('mock_session', JSON.stringify(session));
            notifyAuthListeners('SIGNED_IN', session);
            return { data: { user, session }, error: null };
        },
        signOut: async () => {
            localStorage.removeItem('mock_session');
            // Set explicit null to prevent auto-login logic in getSession
            localStorage.setItem('mock_session', 'null'); 
            notifyAuthListeners('SIGNED_OUT', null);
        }
    },
    functions: {
        invoke: async (name, { body }) => {
            await new Promise(r => setTimeout(r, 1500)); // Simulate AI "thinking" time
            
            if (name === 'analyze-day') {
                const db = loadDB();
                const insight = generateMockInsight(body.userId, body.date, db);
                
                // Save to mock DB
                if (!db.daily_analytics) db.daily_analytics = [];
                const idx = db.daily_analytics.findIndex(a => a.user_id === body.userId && a.date === body.date);
                if (idx >= 0) {
                    db.daily_analytics[idx] = { ...db.daily_analytics[idx], ...insight };
                } else {
                    db.daily_analytics.push({ user_id: body.userId, date: body.date, ...insight });
                }
                saveDB(db);
                
                return { data: insight, error: null };
            }
            return { data: {}, error: null };
        }
    }
};