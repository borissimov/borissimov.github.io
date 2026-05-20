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
