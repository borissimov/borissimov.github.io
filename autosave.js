const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdaiWKhiORA9zpH-ATt0ypSRmZbgcpk0zEV5zjjtNpW86C92EwXiuWkdColflLBW8/exec';
const AUTOSAVE_STORAGE_KEY = 'dossier_session_id';
const AUTOSAVE_DEBOUNCE_MS = 1500;

function initAutosave() {
    function getSessionId() {
        let id = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (!id) {
            id = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem(AUTOSAVE_STORAGE_KEY, id);
        }
        return id;
    }

    const sessionId = getSessionId();
    let saveTimers = {};

    const statusEl = document.getElementById('autosave-status');
    const statusDot = statusEl ? statusEl.querySelector('.status-dot') : null;
    let statusTimer = null;

    function setStatus(state, textBg, textEn) {
        if (!statusEl) return;
        statusEl.className = 'autosave-status ' + state;
        const bgSpan = document.getElementById('autosave-text');
        const enSpan = document.getElementById('autosave-text-en');
        if (bgSpan) bgSpan.textContent = textBg;
        if (enSpan) enSpan.textContent = textEn;
        if (statusDot) {
            statusDot.classList.toggle('pulse', state === 'saving');
        }
    }

    function setStatusIdle() {
        setStatus('', appData.autosave.status.idle.bg, appData.autosave.status.idle.en);
    }

    function saveField(fieldName, value) {
        setStatus('saving', appData.autosave.status.saving.bg, appData.autosave.status.saving.en);

        const payload = {
            session_id: sessionId,
            field: fieldName,
            value: value
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            setStatus('saved', appData.autosave.status.saved.bg, appData.autosave.status.saved.en);
            clearTimeout(statusTimer);
            statusTimer = setTimeout(setStatusIdle, 3000);
        })
        .catch((err) => {
            setStatus('error', appData.autosave.status.error.bg, appData.autosave.status.error.en);
            console.warn('AutoSave error:', err);
            clearTimeout(statusTimer);
            statusTimer = setTimeout(setStatusIdle, 4000);
        });
    }

    function onFieldChange(fieldName, value) {
        clearTimeout(saveTimers[fieldName]);
        saveTimers[fieldName] = setTimeout(() => {
            saveField(fieldName, value);
        }, AUTOSAVE_DEBOUNCE_MS);
    }

    const doctorNameEl = document.getElementById('doctor-name');
    const doctorSpecialtyEl = document.getElementById('doctor-specialty');

    document.querySelectorAll('.q-answer').forEach(textarea => {
        const field = textarea.dataset.field;
        if (!field) return;

        textarea.addEventListener('input', () => {
            textarea.classList.toggle('has-content', textarea.value.trim().length > 0);
            onFieldChange(field, textarea.value);
        });
    });

    if (doctorNameEl) {
        doctorNameEl.addEventListener('input', () => {
            onFieldChange('name', doctorNameEl.value);
        });
    }

    if (doctorSpecialtyEl) {
        doctorSpecialtyEl.addEventListener('input', () => {
            onFieldChange('specialty', doctorSpecialtyEl.value);
        });
    }

    const fields = ['name', 'specialty', 'q1','q2','q3','q4','q5','q6','q7','q8'];
    fields.forEach(f => {
        const cached = localStorage.getItem('ans_' + sessionId + '_' + f);
        if (cached) {
            const el = f === 'name' ? doctorNameEl
                     : f === 'specialty' ? doctorSpecialtyEl
                     : document.getElementById('ans-' + f);
            if (el) {
                el.value = cached;
                if (el.classList.contains('q-answer')) {
                    el.classList.toggle('has-content', cached.trim().length > 0);
                }
            }
        }
    });

    document.querySelectorAll('.q-answer').forEach(textarea => {
        textarea.addEventListener('input', () => {
            localStorage.setItem('ans_' + sessionId + '_' + textarea.dataset.field, textarea.value);
        });
    });
    if (doctorNameEl) doctorNameEl.addEventListener('input', () => {
        localStorage.setItem('ans_' + sessionId + '_name', doctorNameEl.value);
    });
    if (doctorSpecialtyEl) doctorSpecialtyEl.addEventListener('input', () => {
        localStorage.setItem('ans_' + sessionId + '_specialty', doctorSpecialtyEl.value);
    });
}
