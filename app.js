document.addEventListener('DOMContentLoaded', () => {
    if (typeof metadata === 'undefined') {
        console.error("Error: metadata.js not found.");
        document.getElementById('welcome-viewer').innerHTML = `
            <div style="padding: 30px; text-align: center;">
                <h3 style="color:#ef4444;">Error: Metadata Not Found</h3>
                <p>Could not load image series metadata. Please ensure metadata.js exists.</p>
            </div>
        `;
        return;
    }

    const imagesByDate = {};
    Object.keys(metadata).sort().forEach(file => {
        const datePart = file.substring(0, 6);
        if (!imagesByDate[datePart]) imagesByDate[datePart] = [];
        imagesByDate[datePart].push(file);
    });
    const allImages = Object.keys(imagesByDate).sort().flatMap(date => imagesByDate[date]);

    const btnLangBg = document.getElementById('btn-lang-bg');
    const btnLangEn = document.getElementById('btn-lang-en');
    const dossierPanel = document.getElementById('dossier-panel');
    const viewerPanel = document.getElementById('viewer-panel');
    const mobBtnDossier = document.getElementById('mob-btn-dossier');
    const mobBtnViewer = document.getElementById('mob-btn-viewer');
    
    const activeViewerIcon = document.getElementById('active-viewer-icon');
    const activeViewerTitleBg = document.getElementById('active-viewer-title-bg');
    const activeViewerTitleEn = document.getElementById('active-viewer-title-en');
    const viewerQuickActions = document.getElementById('viewer-quick-actions');
    
    const xrayViewer = document.getElementById('xray-viewer');
    const pdfViewer = document.getElementById('pdf-viewer');
    const welcomeViewer = document.getElementById('welcome-viewer');
    const pdfEmbed = document.getElementById('pdf-embed');
    
    const mainImage = document.getElementById('mainImage');
    const displayArea = document.getElementById('imageDisplayArea');
    const thumbnailSidebar = document.getElementById('xray-thumbnails');
    
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    
    let currentGlobalIndex = 0;
    let currentActiveDate = "";
    let scale = 1, isPanning = false, pointX = 0, pointY = 0, start = { x: 0, y: 0 };
    let initialDistance = -1;

    window.switchMobileTab = (tab) => {
        if (tab === 'dossier') {
            dossierPanel.classList.remove('hidden-mobile');
            viewerPanel.classList.remove('active-mobile');
            mobBtnDossier.classList.add('active');
            mobBtnViewer.classList.remove('active');
        } else {
            dossierPanel.classList.add('hidden-mobile');
            viewerPanel.classList.add('active-mobile');
            mobBtnDossier.classList.remove('active');
            mobBtnViewer.classList.add('active');
        }
    };

    const setLanguage = (lang) => {
        if (lang === 'en') {
            document.body.className = 'lang-en';
            btnLangEn.classList.add('active');
            btnLangBg.classList.remove('active');
        } else {
            document.body.className = 'lang-bg';
            btnLangBg.classList.add('active');
            btnLangEn.classList.remove('active');
        }
        updateViewerTitle();
    };

    btnLangBg.onclick = () => setLanguage('bg');
    btnLangEn.onclick = () => setLanguage('en');

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

    const applyImageFilters = () => {
        mainImage.style.filter = `brightness(${brightnessSlider.value}%) contrast(${contrastSlider.value}%)`;
    };
    brightnessSlider.oninput = applyImageFilters;
    contrastSlider.oninput = applyImageFilters;

    const centerAndFitImage = () => {
        const areaWidth = displayArea.clientWidth;
        const areaHeight = displayArea.clientHeight;
        const imgWidth = mainImage.naturalWidth;
        const imgHeight = mainImage.naturalHeight;

        if (imgWidth && imgHeight) {
            scale = Math.min(areaWidth / imgWidth, areaHeight / imgHeight);
            pointX = (areaWidth - imgWidth * scale) / 2;
            pointY = (areaHeight - imgHeight * scale) / 2;
            applyTransform();
        }
    };

    const applyTransform = () => {
        mainImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    };

    const clampPan = () => {
        const areaWidth = displayArea.clientWidth;
        const areaHeight = displayArea.clientHeight;
        const imgWidth = mainImage.naturalWidth * scale;
        const imgHeight = mainImage.naturalHeight * scale;

        const minX = areaWidth - imgWidth;
        const minY = areaHeight - imgHeight;

        if (imgWidth <= areaWidth) {
            pointX = (areaWidth - imgWidth) / 2;
        } else {
            pointX = Math.max(minX, Math.min(0, pointX));
        }

        if (imgHeight <= areaHeight) {
            pointY = (areaHeight - imgHeight) / 2;
        } else {
            pointY = Math.max(minY, Math.min(0, pointY));
        }
    };

    const updateUIForCurrentImage = () => {
        const imageFile = allImages[currentGlobalIndex];
        const datePart = imageFile.substring(0, 6);
        currentActiveDate = datePart;

        const currentImageList = imagesByDate[datePart];
        thumbnailSidebar.innerHTML = '';
        currentImageList.forEach((file) => {
            const thumbContainer = document.createElement('div');
            thumbContainer.className = 'thumbnail-container';
            if (file === imageFile) {
                thumbContainer.classList.add('active');
            }
            thumbContainer.onclick = () => {
                currentGlobalIndex = allImages.indexOf(file);
                updateUIForCurrentImage();
            };
            const thumbImg = document.createElement('img');
            thumbImg.src = file;
            thumbContainer.appendChild(thumbImg);
            thumbnailSidebar.appendChild(thumbContainer);
        });

        mainImage.src = imageFile;
        const localIndex = currentImageList.indexOf(imageFile);
        document.getElementById('image-counter').textContent = `${localIndex + 1} / ${currentImageList.length}`;

        const meta = metadata[imageFile];
        const birthDate = new Date('1984-01-10');
        const studyDate = new Date(meta.study_date);
        const firstXrayDate = new Date('2025-05-14');

        let age = studyDate.getFullYear() - birthDate.getFullYear();
        const m = studyDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && studyDate.getDate() < birthDate.getDate())) {
            age--;
        }
        const diffDays = Math.ceil(Math.abs(studyDate - firstXrayDate) / (1000 * 60 * 60 * 24));
        
        document.getElementById('meta-dob-age').textContent = `10 Jan 1984 (Age: ${age})`;
        document.getElementById('meta-days-since').textContent = diffDays;

        brightnessSlider.value = 100;
        contrastSlider.value = 100;
        applyImageFilters();

        mainImage.onload = () => {
            centerAndFitImage();
            mainImage.onload = null;
        };

        updateViewerTitle();
    };

    const getFormattedDateText = (datePart) => {
        if(!datePart) return "";
        const monthsBG = ["Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек", "Яну", "Фев", "Мар", "Апр"];
        const monthsEN = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
        const yy = datePart.substring(0, 2);
        const mm = parseInt(datePart.substring(2, 4), 10);
        const dd = parseInt(datePart.substring(4, 6), 10);
        
        const mIdx = mm === 5 ? 0 : mm === 6 ? 1 : mm === 7 ? 2 : mm === 8 ? 3 : mm === 9 ? 4 : mm === 10 ? 5 : mm === 11 ? 6 : mm === 12 ? 7 : mm === 1 ? 8 : mm === 2 ? 9 : mm === 3 ? 10 : 11;
        
        return {
            bg: `${dd} ${monthsBG[mIdx]} 20${yy} г.`,
            en: `${dd} ${monthsEN[mIdx]} 20${yy}`
        };
    };

    let activeViewMode = 'welcome';
    let activePDFType = '';

    const updateViewerTitle = () => {
        if (activeViewMode === 'welcome') {
            activeViewerIcon.textContent = '🩺';
            activeViewerTitleBg.textContent = appData.viewer.defaultTitle.bg;
            activeViewerTitleEn.textContent = appData.viewer.defaultTitle.en;
        } else if (activeViewMode === 'xray') {
            activeViewerIcon.textContent = '🩻';
            const dateText = getFormattedDateText(currentActiveDate);
            activeViewerTitleBg.textContent = `Рентгенови снимки от ${dateText.bg}`;
            activeViewerTitleEn.textContent = `X-Rays from ${dateText.en}`;
        } else if (activeViewMode === 'pdf') {
            activeViewerIcon.textContent = activePDFType === 'MRI' ? '📄' : '☢️';
            if (activePDFType === 'MRI') {
                activeViewerTitleBg.textContent = 'ЯМР Разчитане (24.07.2025 г.)';
                activeViewerTitleEn.textContent = 'MRI Report (24.07.2025)';
            } else {
                activeViewerTitleBg.textContent = 'КТ Разчитане (23.04.2026 г.)';
                activeViewerTitleEn.textContent = 'CT Report (23.04.2026)';
            }
        }
    };

    window.loadXrayDate = (datePart) => {
        activeViewMode = 'xray';
        welcomeViewer.classList.remove('active');
        pdfViewer.classList.remove('active');
        xrayViewer.classList.add('active');
        
        viewerQuickActions.innerHTML = '';

        const firstImage = imagesByDate[datePart][0];
        currentGlobalIndex = allImages.indexOf(firstImage);
        updateUIForCurrentImage();
        
        switchMobileTab('viewer');
    };

    window.loadPDF = (type, skipMobileSwitch = false) => {
        activeViewMode = 'pdf';
        activePDFType = type;
        welcomeViewer.classList.remove('active');
        xrayViewer.classList.remove('active');
        pdfViewer.classList.add('active');

        viewerQuickActions.innerHTML = '';
        
        let pdfFile = '';
        let dicomUrl = '';
        let btnColorClass = '';
        
        if (type === 'MRI') {
            pdfFile = appData.studies.mri.pdfFile;
            dicomUrl = appData.studies.mri.dicomUrl;
            btnColorClass = 'mri-btn';
        } else {
            pdfFile = appData.studies.ct.pdfFile;
            dicomUrl = appData.studies.ct.dicomUrl;
            btnColorClass = 'ct-btn';
        }

        pdfEmbed.src = pdfFile;

        const dlBtn = document.createElement('a');
        dlBtn.className = 'viewer-btn primary';
        dlBtn.href = pdfFile;
        dlBtn.download = pdfFile;
        dlBtn.innerHTML = `⬇️ <span data-lang="bg">Свали PDF</span><span data-lang="en">Download PDF</span>`;
        viewerQuickActions.appendChild(dlBtn);

        const studyBtn = document.createElement('a');
        studyBtn.className = `viewer-btn ${btnColorClass}`;
        studyBtn.href = dicomUrl;
        studyBtn.target = '_blank';
        if (type === 'MRI') {
            studyBtn.innerHTML = `🩻 <span data-lang="bg">${appData.studies.mri.viewOnline.bg.replace('🩻 ', '')}</span><span data-lang="en">${appData.studies.mri.viewOnline.en.replace('🩻 ', '')}</span>`;
        } else {
            studyBtn.innerHTML = `🩻 <span data-lang="bg">${appData.studies.ct.viewOnline.bg.replace('🩻 ', '')}</span><span data-lang="en">${appData.studies.ct.viewOnline.en.replace('🩻 ', '')}</span>`;
        }
        viewerQuickActions.appendChild(studyBtn);

        updateViewerTitle();
        
        if (!skipMobileSwitch) {
            switchMobileTab('viewer');
        }
    };

    const zoom = (factor, center) => {
        const rect = displayArea.getBoundingClientRect();
        const mouseX = center.x - rect.left;
        const mouseY = center.y - rect.top;

        const xs = (mouseX - pointX) / scale;
        const ys = (mouseY - pointY) / scale;
        
        const oldScale = scale;
        let newScale = scale * factor;
        
        const minScale = Math.min(displayArea.clientWidth / mainImage.naturalWidth, displayArea.clientHeight / mainImage.naturalHeight);
        newScale = Math.max(minScale, Math.min(newScale, 20));

        if (newScale === oldScale) return;

        pointX = mouseX - xs * newScale;
        pointY = mouseY - ys * newScale;
        scale = newScale;

        clampPan();
        applyTransform();
    };

    document.getElementById("zoomInBtn").onclick = () => zoom(1.2, {x: displayArea.clientWidth / 2, y: displayArea.clientHeight / 2});
    document.getElementById("zoomOutBtn").onclick = () => zoom(0.8, {x: displayArea.clientWidth / 2, y: displayArea.clientHeight / 2});
    
    const changeImage = (direction) => {
        if (activeViewMode !== 'xray') return;
        const currentImageList = imagesByDate[currentActiveDate];
        const currentFile = allImages[currentGlobalIndex];
        const localIndex = currentImageList.indexOf(currentFile);
        
        const newLocalIndex = (localIndex + direction + currentImageList.length) % currentImageList.length;
        const nextFile = currentImageList[newLocalIndex];
        currentGlobalIndex = allImages.indexOf(nextFile);
        updateUIForCurrentImage();
    };

    document.getElementById('prevImageBtn').onclick = () => changeImage(-1);
    document.getElementById('nextImageBtn').onclick = () => changeImage(1);

    displayArea.onmousedown = (e) => {
        if (e.target !== mainImage) return;
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        isPanning = true;
        displayArea.style.cursor = 'grabbing';
    };
    
    window.onmouseup = () => { 
        isPanning = false; 
        displayArea.style.cursor = 'grab'; 
    };
    
    window.onmousemove = (e) => { 
        if (isPanning) { 
            pointX = e.clientX - start.x; 
            pointY = e.clientY - start.y; 
            clampPan();
            applyTransform();
        } 
    };

    displayArea.onwheel = (e) => {
        e.preventDefault();
        const delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        const factor = delta > 0 ? 1.1 : 0.9;
        zoom(factor, {x: e.clientX, y: e.clientY});
    };

    displayArea.addEventListener('touchstart', (e) => {
        if (e.target !== mainImage) return;
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            start = { x: touch.clientX - pointX, y: touch.clientY - pointY };
            isPanning = true;
        } else if (e.touches.length === 2) {
            isPanning = false;
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            initialDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        }
    });

    displayArea.addEventListener('touchend', () => {
        isPanning = false;
        initialDistance = -1;
    });

    displayArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isPanning && e.touches.length === 1) {
            const touch = e.touches[0];
            pointX = touch.clientX - start.x;
            pointY = touch.clientY - start.y;
            clampPan();
            applyTransform();
        } else if (e.touches.length === 2 && initialDistance > 0) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currentDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const factor = currentDistance / initialDistance;
            zoom(factor, {x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2});
            initialDistance = currentDistance;
        }
    });

    window.onresize = () => {
        if (activeViewMode === 'xray') {
            centerAndFitImage();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (activeViewMode !== 'xray') return;
        if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    });

    loadPDF('CT', true);
});
