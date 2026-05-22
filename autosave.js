const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdaiWKhiORA9zpH-ATt0ypSRmZbgcpk0zEV5zjjtNpW86C92EwXiuWkdColflLBW8/exec';
const ACCESS_PASSWORD = '123';
const STORAGE_KEY_SESSIONS = 'my_sessions';
const STORAGE_KEY_CURRENT = 'current_session_id';
const AUTOSAVE_DEBOUNCE_MS = 1500;

let currentSessionId = '';
let saveTimers = {};
let statusTimer = null;
let isLoadingSession = false;

function normalizeDate(d) {
    if (!d) return '';
    if (d.includes('T')) return d.split('T')[0];
    return d;
}

function initAutosave() {
    restoreMySessions();
    loadLastSession();
    setupEventListeners();
}

function restoreMySessions() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveMySessions(sessions) {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

function addMySession(sid) {
    const sessions = restoreMySessions();
    if (!sessions.includes(sid)) {
        sessions.unshift(sid);
        saveMySessions(sessions);
    }
}

function removeMySession(sid) {
    const sessions = restoreMySessions().filter(s => s !== sid);
    saveMySessions(sessions);
}

function isMySession(sid) {
    return restoreMySessions().includes(sid);
}

function loadLastSession() {
    const lastId = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (lastId && isMySession(lastId)) {
        fetchSession(lastId, true);
    } else {
        createNewSession();
    }
}

function createNewSession() {
    currentSessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(STORAGE_KEY_CURRENT, currentSessionId);
    addMySession(currentSessionId);
    clearForm();
    const consultationDateEl = document.getElementById('consultation-date');
    if (consultationDateEl) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        consultationDateEl.value = `${yyyy}-${mm}-${dd}`;
    }
    updateSessionUI();
}

function setupEventListeners() {
    document.querySelectorAll('.q-answer').forEach(textarea => {
        const field = textarea.dataset.field;
        if (!field) return;
        textarea.addEventListener('input', () => {
            textarea.classList.toggle('has-content', textarea.value.trim().length > 0);
            onFieldChange(field, textarea.value);
        });
    });

    const doctorNameEl = document.getElementById('doctor-name');
    const doctorSpecialtyEl = document.getElementById('doctor-specialty');
    const consultationDateEl = document.getElementById('consultation-date');

    if (doctorNameEl) {
        doctorNameEl.addEventListener('input', () => {
            onFieldChange('name', doctorNameEl.value);
            updateSessionUI();
        });
    }
    if (doctorSpecialtyEl) {
        doctorSpecialtyEl.addEventListener('input', () => {
            onFieldChange('specialty', doctorSpecialtyEl.value);
        });
    }
    if (consultationDateEl) {
        consultationDateEl.addEventListener('change', () => {
            onFieldChange('consultation_date', consultationDateEl.value);
        });
    }
}

function onFieldChange(fieldName, value) {
    clearTimeout(saveTimers[fieldName]);
    saveTimers[fieldName] = setTimeout(() => {
        saveField(fieldName, value);
    }, AUTOSAVE_DEBOUNCE_MS);
}

function saveField(fieldName, value) {
    if (isLoadingSession) return;
    setStatus('saving', '⏳ Записване...', '⏳ Saving...');

    const questionMap = { name: 'name', specialty: 'specialty', consultation_date: 'consultation_date' };
    const questionNum = questionMap[fieldName] || fieldName;
    const questionText = getQuestionText(fieldName);

    const doctorNameEl = document.getElementById('doctor-name');
    const doctorSpecialtyEl = document.getElementById('doctor-specialty');
    const consultationDateEl = document.getElementById('consultation-date');

    const payload = {
        session_id: currentSessionId,
        question_num: questionNum,
        question_text: questionText,
        value: value,
        consultation_date: consultationDateEl ? consultationDateEl.value : '',
        doctor_name: doctorNameEl ? doctorNameEl.value : '',
        specialty: doctorSpecialtyEl ? doctorSpecialtyEl.value : ''
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            setStatus('saved', '✅ Записано', '✅ Saved');
        } else {
            console.warn('Save warning:', data.message);
            setStatus('saved', '✅ Записано', '✅ Saved');
        }
        clearTimeout(statusTimer);
        statusTimer = setTimeout(setStatusIdle, 3000);
    })
    .catch((err) => {
        setStatus('error', '⚠️ Грешка при записване', '⚠️ Save error');
        clearTimeout(statusTimer);
        statusTimer = setTimeout(setStatusIdle, 4000);
    });
}

function getQuestionText(fieldName) {
    if (fieldName === 'name') return 'Лекар / Д-р';
    if (fieldName === 'specialty') return 'Специалност';
    if (fieldName === 'consultation_date') return 'Дата на консултация';
    const q = appData.questions.items.find(q => 'q' + q.num === fieldName);
    return q ? (q.text.bg + ' | ' + q.text.en) : fieldName;
}

function fetchSession(sessionId, skipPassword) {
    isLoadingSession = true;

    console.log('Loading session:', sessionId, 'skipPassword:', skipPassword);

    const payload = {
        action: 'load',
        session_id: sessionId,
        password: ACCESS_PASSWORD
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(data => {
            console.log('Session loaded:', data);
            if (data.status === 'ok' && data.session) {
                populateForm(data.session);
                currentSessionId = sessionId;
                localStorage.setItem(STORAGE_KEY_CURRENT, currentSessionId);
                addMySession(currentSessionId);
                updateSessionUI();
            } else {
                console.error('Failed to load session:', data.message);
                // Clean up stale session from localStorage
                removeMySession(sessionId);
                if (!isMySession(sessionId) || restoreMySessions().length === 0) {
                    createNewSession();
                }
            }
            isLoadingSession = false;
        })
        .catch(err => {
            console.error('Error loading session:', err);
            isLoadingSession = false;
        });
}

function populateForm(session) {
    clearForm();

    const doctorNameEl = document.getElementById('doctor-name');
    const doctorSpecialtyEl = document.getElementById('doctor-specialty');
    const consultationDateEl = document.getElementById('consultation-date');

    if (doctorNameEl && session.doctor_name) {
        doctorNameEl.value = session.doctor_name;
    }
    if (doctorSpecialtyEl && session.specialty) {
        doctorSpecialtyEl.value = session.specialty;
    }
    if (consultationDateEl && session.consultation_date) {
        consultationDateEl.value = normalizeDate(session.consultation_date);
    }

    session.answers.forEach(a => {
        if (a.question_num && a.question_num.startsWith('q')) {
            const el = document.getElementById('ans-' + a.question_num);
            if (el) {
                el.value = a.answer;
                el.classList.toggle('has-content', String(a.answer).trim().length > 0);
            }
        } else if (a.question_num === 'name' && doctorNameEl) {
            doctorNameEl.value = a.answer;
        } else if (a.question_num === 'specialty' && doctorSpecialtyEl) {
            doctorSpecialtyEl.value = a.answer;
        } else if (a.question_num === 'consultation_date' && consultationDateEl) {
            consultationDateEl.value = a.answer;
        }
    });
}

function clearForm() {
    document.querySelectorAll('.q-answer').forEach(ta => {
        ta.value = '';
        ta.classList.remove('has-content');
    });
    const doctorNameEl = document.getElementById('doctor-name');
    const doctorSpecialtyEl = document.getElementById('doctor-specialty');
    const consultationDateEl = document.getElementById('consultation-date');
    if (doctorNameEl) doctorNameEl.value = '';
    if (doctorSpecialtyEl) doctorSpecialtyEl.value = '';
    if (consultationDateEl) consultationDateEl.value = '';
}

function updateSessionUI() {
    const sessionIdDisplay = document.getElementById('current-session-id');
    if (sessionIdDisplay) {
        const doctorNameEl = document.getElementById('doctor-name');
        const doctorName = doctorNameEl && doctorNameEl.value ? doctorNameEl.value : '—';
        const mySessions = restoreMySessions();
        const doctorSessions = [];

        // Fetch to get session number
        fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'list', password: ACCESS_PASSWORD })
        })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'ok') {
                    const allSessions = data.sessions;
                    const doctorSessionsList = allSessions.filter(s => s.doctor_name === doctorName);
                    const idx = doctorSessionsList.findIndex(s => s.session_id === currentSessionId);
                    const num = idx >= 0 ? idx + 1 : '?';
                    sessionIdDisplay.textContent = `${doctorName} — Сесия ${num}`;
                }
            })
            .catch(() => {
                sessionIdDisplay.textContent = `${doctorName} — ${currentSessionId.substring(0, 12)}...`;
            });
    }
}

function setStatus(state, textBg, textEn) {
    const statusEl = document.getElementById('autosave-status');
    if (!statusEl) return;
    statusEl.className = 'autosave-status ' + state;
    const bgSpan = document.getElementById('autosave-text');
    const enSpan = document.getElementById('autosave-text-en');
    if (bgSpan) bgSpan.textContent = textBg;
    if (enSpan) enSpan.textContent = textEn;
    const statusDot = statusEl.querySelector('.status-dot');
    if (statusDot) {
        statusDot.classList.toggle('pulse', state === 'saving');
    }
}

function setStatusIdle() {
    setStatus('', appData.autosave.status.idle.bg, appData.autosave.status.idle.en);
}

// Public API
window.createNewSession = createNewSession;
window.loadSession = fetchSession;
