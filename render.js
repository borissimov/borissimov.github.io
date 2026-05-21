function renderApp() {
    renderPatientHeader();
    renderClinicalAlert();
    renderNavTabs();
    renderSummarySection();
    renderStudiesSection();
    renderTimelineSection();
    renderQuestionsSection();
    renderMobileNav();
}

function renderPatientHeader() {
    const p = appData.patient;
    document.querySelector('.patient-name').textContent = p.name;
    document.querySelector('.patient-meta').innerHTML = `
        <span>42y Male (${p.dob})</span><br>
        <span data-lang="bg">${p.goal.bg}</span>
        <span data-lang="en">${p.goal.en}</span>
    `;
}

function renderClinicalAlert() {
    const alert = appData.clinicalAlert;
    const alertEl = document.querySelector('.clinical-alert');
    alertEl.innerHTML = `
        <h4 data-lang="bg">${alert.title.bg}</h4>
        <h4 data-lang="en">${alert.title.en}</h4>
        <p data-lang="bg">${alert.content.bg}</p>
        <p data-lang="en">${alert.content.en}</p>
    `;
}

function renderNavTabs() {
    const nav = document.querySelector('.dossier-nav');
    nav.innerHTML = appData.navTabs.map((tab, i) => `
        <button class="nav-tab-btn ${i === 0 ? 'active' : ''}" data-section="${tab.id}">
            <span data-lang="bg">${tab.bg}</span>
            <span data-lang="en">${tab.en}</span>
        </button>
    `).join('');

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetSection = btn.dataset.section;
            document.querySelectorAll('.dossier-section').forEach(sec => {
                sec.classList.remove('active');
            });
            document.getElementById(targetSection).classList.add('active');
        };
    });
}

function renderSummarySection() {
    const section = document.getElementById('sec-summary');
    const s = appData.summary;
    
    let comparisonRows = s.comparison.rows.map(row => {
        const ctClass = row.ct.danger ? ' class="danger-text"' : (row.ct.warning ? ' class="warning-text"' : '');
        return `
            <tr>
                <td class="bold-td">
                    <span data-lang="bg">${row.finding.bg}</span>
                    <span data-lang="en">${row.finding.en}</span>
                </td>
                <td>
                    <span data-lang="bg">${row.mri.bg}</span>
                    <span data-lang="en">${row.mri.en}</span>
                </td>
                <td${ctClass}>
                    <span data-lang="bg">${row.ct.bg}</span>
                    <span data-lang="en">${row.ct.en}</span>
                </td>
            </tr>
        `;
    }).join('');

    section.innerHTML = `
        <div class="dossier-card">
            <h3 data-lang="bg">${s.injuryHistory.title.bg}</h3>
            <h3 data-lang="en">${s.injuryHistory.title.en}</h3>
            <div class="summary-text">
                <p data-lang="bg">${s.injuryHistory.content.bg}</p>
                <p data-lang="en">${s.injuryHistory.content.en}</p>
            </div>
        </div>

        <div class="dossier-card">
            <h3 data-lang="bg">${s.comparison.title.bg}</h3>
            <h3 data-lang="en">${s.comparison.title.en}</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th style="width: 30%">
                            <span data-lang="bg">${s.comparison.headers[0].bg}</span>
                            <span data-lang="en">${s.comparison.headers[0].en}</span>
                        </th>
                        <th style="width: 35%">
                            <span data-lang="bg">${s.comparison.headers[1].bg}</span>
                            <span data-lang="en">${s.comparison.headers[1].en}</span>
                        </th>
                        <th style="width: 35%">
                            <span data-lang="bg">${s.comparison.headers[2].bg}</span>
                            <span data-lang="en">${s.comparison.headers[2].en}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${comparisonRows}
                </tbody>
            </table>
        </div>
    `;
}

function renderStudiesSection() {
    const section = document.getElementById('sec-studies');
    const st = appData.studies;
    
    const xrayGrid = st.xrayArchive.dates.map(xray => `
        <div class="xray-grid-item" onclick="loadXrayDate('${xray.id}')">
            <div class="xray-grid-date">${xray.date}</div>
            <div class="xray-grid-label" data-lang="bg">${xray.label.bg}</div>
            <div class="xray-grid-label" data-lang="en">${xray.label.en}</div>
        </div>
    `).join('');

    section.innerHTML = `
        <div class="study-card ${st.ct.cardClass}" onclick="loadPDF('CT')">
            <div class="study-card-icon">${st.ct.icon}</div>
            <div class="study-card-content">
                <h4 data-lang="bg">${st.ct.title.bg}</h4>
                <h4 data-lang="en">${st.ct.title.en}</h4>
                <p data-lang="bg">${st.ct.description.bg}</p>
                <p data-lang="en">${st.ct.description.en}</p>
                <div class="study-card-actions">
                    <span class="action-link" onclick="loadPDF('CT')" data-lang="bg">${st.ct.reportLink.bg}</span>
                    <span class="action-link" onclick="loadPDF('CT')" data-lang="en">${st.ct.reportLink.en}</span>
                    <a href="${st.ct.dicomUrl}" target="_blank" onclick="event.stopPropagation()" class="action-link" data-lang="bg">${st.ct.viewOnline.bg}</a>
                    <a href="${st.ct.dicomUrl}" target="_blank" onclick="event.stopPropagation()" class="action-link" data-lang="en">${st.ct.viewOnline.en}</a>
                </div>
            </div>
        </div>

        <div class="study-card ${st.mri.cardClass}" onclick="loadPDF('MRI')">
            <div class="study-card-icon">${st.mri.icon}</div>
            <div class="study-card-content">
                <h4 data-lang="bg">${st.mri.title.bg}</h4>
                <h4 data-lang="en">${st.mri.title.en}</h4>
                <p data-lang="bg">${st.mri.description.bg}</p>
                <p data-lang="en">${st.mri.description.en}</p>
                <div class="study-card-actions">
                    <span class="action-link" onclick="loadPDF('MRI')" data-lang="bg">${st.mri.reportLink.bg}</span>
                    <span class="action-link" onclick="loadPDF('MRI')" data-lang="en">${st.mri.reportLink.en}</span>
                    <a href="${st.mri.dicomUrl}" target="_blank" onclick="event.stopPropagation()" class="action-link" data-lang="bg">${st.mri.viewOnline.bg}</a>
                    <a href="${st.mri.dicomUrl}" target="_blank" onclick="event.stopPropagation()" class="action-link" data-lang="en">${st.mri.viewOnline.en}</a>
                </div>
            </div>
        </div>

        <div class="dossier-card">
            <h3 data-lang="bg">${st.xrayArchive.title.bg}</h3>
            <h3 data-lang="en">${st.xrayArchive.title.en}</h3>
            <p style="font-size:12.5px; color:var(--text-secondary); margin:-5px 0 15px 0;" data-lang="bg">
                ${st.xrayArchive.subtitle.bg}
            </p>
            <p style="font-size:12.5px; color:var(--text-secondary); margin:-5px 0 15px 0;" data-lang="en">
                ${st.xrayArchive.subtitle.en}
            </p>
            
            <div class="xray-grid">
                ${xrayGrid}
            </div>
        </div>
    `;
}

function renderTimelineSection() {
    const section = document.getElementById('sec-timeline');
    const timeline = appData.timeline;
    
    const items = timeline.map(event => {
        const clickable = event.clickable ? ' clickable' : '';
        const onclick = event.clickable ? ` onclick="${event.action}"` : '';
        const panelClass = event.panelClass ? ` ${event.panelClass}` : '';
        const viewIndicator = event.viewIndicator ? `<span class="view-indicator">${event.viewIndicator}</span>` : '';
        
        return `
            <div class="timeline-item${clickable}"${onclick}>
                <div class="timeline-badge ${event.badge}">${event.badgeIcon}</div>
                <div class="timeline-panel${panelClass}">
                    <div class="timeline-date">${event.date}</div>
                    <h4>
                        <span data-lang="bg">${event.title.bg}</span>
                        <span data-lang="en">${event.title.en}</span>
                        ${viewIndicator}
                    </h4>
                    <p data-lang="bg">${event.description.bg}</p>
                    <p data-lang="en">${event.description.en}</p>
                </div>
            </div>
        `;
    }).join('');

    section.innerHTML = `
        <div class="timeline-container">
            ${items}
        </div>
    `;
}

function renderQuestionsSection() {
    const section = document.getElementById('sec-questions');
    const q = appData.questions;

    let html = `
        <div class="questions-list">
            <div class="doctor-identity-panel">
                <h4>🩺 <span data-lang="bg">${q.doctorPanel.title.bg.replace('🩺 ', '')}</span><span data-lang="en">${q.doctorPanel.title.en.replace('🩺 ', '')}</span></h4>
                <div class="doctor-identity-fields">
                    <input type="date" id="consultation-date" title="${q.doctorPanel.consultationDateLabel.bg}">
                    <input type="text" id="doctor-name" placeholder="${q.doctorPanel.namePlaceholder}" autocomplete="off">
                    <input type="text" id="doctor-specialty" placeholder="${q.doctorPanel.specialtyPlaceholder}" autocomplete="off">
                </div>
                <div class="session-controls">
                    <span class="session-id-display">
                        <span data-lang="bg">Сесия:</span><span data-lang="en">Session:</span>
                        <span id="current-session-id"></span>
                    </span>
                    <div class="session-actions">
                        <button class="session-btn" onclick="window.createNewSession()" title="Нова сесия">➕ <span data-lang="bg">Нова</span><span data-lang="en">New</span></button>
                        <button class="session-btn" onclick="showSessionModal()" title="Зареди сесия">📂 <span data-lang="bg">Зареди</span><span data-lang="en">Load</span></button>
                    </div>
                </div>
                <div class="autosave-status" id="autosave-status">
                    <div class="status-dot"></div>
                    <span id="autosave-text" data-lang="bg">${appData.autosave.status.idle.bg}</span>
                    <span id="autosave-text-en" data-lang="en">${appData.autosave.status.idle.en}</span>
                </div>
            </div>
    `;

    let currentCategory = -1;
    q.items.forEach(item => {
        if (item.category !== currentCategory) {
            currentCategory = item.category;
            const cat = q.categories[currentCategory];
            html += `
                <div class="question-category">
                    <h4 class="category-title">
                        <span class="category-num">${cat.num}.</span>
                        <span data-lang="bg">${cat.title.bg}</span>
                        <span data-lang="en">${cat.title.en}</span>
                    </h4>
                </div>
            `;
        }

        html += `
            <div class="question-card">
                <div class="q-num">${item.num}</div>
                <div class="q-body">
                    <p data-lang="bg">${item.text.bg}</p>
                    <p data-lang="en">${item.text.en}</p>
                    <label class="answer-label" for="ans-q${item.num}">✏️ Отговор / Answer</label>
                    <textarea class="q-answer" id="ans-q${item.num}" data-field="q${item.num}" placeholder="Напишете вашия коментар тук..."></textarea>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    section.innerHTML = html;
}

function renderMobileNav() {
    const nav = document.getElementById('mobile-nav-bar');
    const m = appData.mobileNav;
    
    nav.innerHTML = `
        <button id="mob-btn-dossier" class="mob-nav-btn active" onclick="switchMobileTab('dossier')">
            <span>${m.dossier.icon}</span>
            <span data-lang="bg">${m.dossier.bg}</span>
            <span data-lang="en">${m.dossier.en}</span>
        </button>
        <button id="mob-btn-viewer" class="mob-nav-btn" onclick="switchMobileTab('viewer')">
            <span>${m.viewer.icon}</span>
            <span data-lang="bg">${m.viewer.bg}</span>
            <span data-lang="en">${m.viewer.en}</span>
        </button>
    `;
}

function showSessionModal() {
    let modal = document.getElementById('session-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'session-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 data-lang="bg">Избери сесия</h3>
                    <h3 data-lang="en">Select Session</h3>
                    <button class="modal-close" onclick="closeSessionModal()">✕</button>
                </div>
                <div class="modal-tabs">
                    <button class="modal-tab active" data-tab="my" onclick="switchModalTab('my')">
                        <span data-lang="bg">Моите сесии</span>
                        <span data-lang="en">My Sessions</span>
                    </button>
                    <button class="modal-tab" data-tab="all" onclick="switchModalTab('all')">
                        <span data-lang="bg">Всички сесии</span>
                        <span data-lang="en">All Sessions</span>
                    </button>
                </div>
                <div id="modal-password-section" style="display:none;">
                    <div class="password-input-group">
                        <input type="password" id="modal-password" placeholder="Парола / Password">
                        <button class="modal-btn primary" onclick="unlockAllSessions()">
                            <span data-lang="bg">Отключи</span>
                            <span data-lang="en">Unlock</span>
                        </button>
                    </div>
                    <p class="password-hint" data-lang="bg">Нужна е парола за достъп до всички сесии</p>
                    <p class="password-hint" data-lang="en">Password required to access all sessions</p>
                </div>
                <div id="session-modal-list" class="modal-session-list"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
    switchModalTab('my');
}

function closeSessionModal() {
    const modal = document.getElementById('session-modal');
    if (modal) modal.classList.remove('active');
}

let allSessionsUnlocked = false;

function switchModalTab(tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.modal-tab[data-tab="${tab}"]`).classList.add('active');

    const passwordSection = document.getElementById('modal-password-section');
    const listEl = document.getElementById('session-modal-list');

    if (tab === 'my') {
        passwordSection.style.display = 'none';
        renderMySessionsList(listEl);
    } else {
        if (allSessionsUnlocked) {
            passwordSection.style.display = 'none';
            renderAllSessionsList(listEl);
        } else {
            passwordSection.style.display = 'block';
            listEl.innerHTML = '';
        }
    }
}

function getSessionLabel(session, allSessions) {
    const doctorName = session.doctor_name || 'Без име';
    const doctorSessions = (allSessions || []).filter(s => s.doctor_name === doctorName);
    const index = doctorSessions.findIndex(s => s.session_id === session.session_id);
    const num = index >= 0 ? index + 1 : '?';
    return `${doctorName} — Сесия ${num}`;
}

function renderMySessionsList(container) {
    const sessions = restoreMySessions();
    if (sessions.length === 0) {
        container.innerHTML = `<p class="modal-empty" data-lang="bg">Няма запазени сесии</p><p class="modal-empty" data-lang="en">No saved sessions</p>`;
        return;
    }

    // Fetch my sessions data to get doctor names
    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'list', password: ACCESS_PASSWORD })
    })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                const allSessions = data.sessions;
                const mySessionsData = sessions
                    .map(sid => allSessions.find(s => s.session_id === sid))
                    .filter(Boolean);

                container.innerHTML = mySessionsData.map(s => {
                    const isActive = s.session_id === currentSessionId;
                    const label = getSessionLabel(s, allSessions);
                    return `
                        <div class="modal-session-item ${isActive ? 'active' : ''}" onclick="selectSession('${s.session_id}')">
                            <div class="session-item-info">
                                <div class="session-item-id">${label}</div>
                                <div class="session-item-meta">
                                    ${s.specialty ? `<span>🏥 ${s.specialty}</span>` : ''}
                                    ${s.consultation_date ? `<span>📅 ${s.consultation_date}</span>` : ''}
                                    <span>💬 ${s.answer_count} отговора</span>
                                </div>
                            </div>
                            <div class="session-item-actions">
                                <span class="session-badge ${isActive ? 'current' : ''}">${isActive ? '● Active' : '○'}</span>
                            </div>
                        </div>
                    `;
                }).join('') + `<button class="modal-btn" style="margin:12px auto;display:block;" onclick="clearAllMySessions()">🗑️ Clear all local sessions</button>`;
            }
        })
        .catch(() => {
            container.innerHTML = sessions.map(sid => `
                <div class="modal-session-item" onclick="selectSession('${sid}')">
                    <div class="session-item-id">${sid.substring(0, 24)}...</div>
                </div>
            `).join('');
        });
}

function renderAllSessionsList(container, sessions) {
    if (!sessions || sessions.length === 0) {
        container.innerHTML = `<p class="modal-empty" data-lang="bg">Няма намерени сесии</p><p class="modal-empty" data-lang="en">No sessions found</p>`;
        return;
    }

    container.innerHTML = sessions.map(s => {
        const isMine = isMySession(s.session_id);
        const isActive = s.session_id === currentSessionId;
        const label = getSessionLabel(s, sessions);
        return `
            <div class="modal-session-item ${isActive ? 'active' : ''}" onclick="selectSession('${s.session_id}')">
                <div class="session-item-info">
                    <div class="session-item-id">${label}</div>
                    <div class="session-item-meta">
                        ${s.specialty ? `<span>🏥 ${s.specialty}</span>` : ''}
                        ${s.consultation_date ? `<span>📅 ${s.consultation_date}</span>` : ''}
                        <span>💬 ${s.answer_count} отговора</span>
                    </div>
                </div>
                <div class="session-item-actions">
                    ${isMine ? '<span class="session-badge mine">Моя</span>' : ''}
                    <span class="session-badge ${isActive ? 'current' : ''}">${isActive ? '● Active' : '○'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function unlockAllSessions() {
    const passwordInput = document.getElementById('modal-password');
    if (passwordInput.value === '123') {
        allSessionsUnlocked = true;
        fetchAllSessions();
    } else {
        passwordInput.style.borderColor = '#f87171';
        setTimeout(() => { passwordInput.style.borderColor = ''; }, 2000);
    }
}

function fetchAllSessions() {
    const listEl = document.getElementById('session-modal-list');
    listEl.innerHTML = '<p class="modal-empty">Зареждане...</p>';

    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'list', password: '123' })
    })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                renderAllSessionsList(listEl, data.sessions);
            } else {
                listEl.innerHTML = '<p class="modal-empty">Грешка при зареждане</p>';
            }
        })
        .catch(() => {
            listEl.innerHTML = '<p class="modal-empty">Грешка при зареждане</p>';
        });
}

function selectSession(sessionId) {
    if (sessionId === currentSessionId) {
        closeSessionModal();
        return;
    }

    const isMine = isMySession(sessionId);
    if (isMine) {
        window.loadSession(sessionId, true);
        closeSessionModal();
    } else {
        window.loadSession(sessionId, false);
        closeSessionModal();
    }
}

function clearAllMySessions() {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_CURRENT);
    createNewSession();
    closeSessionModal();
}

