const appData = {
    patient: {
        name: "Simov, Boris S.",
        dob: "10 Jan 1984",
        age: 42,
        goal: {
            bg: "🎯 <strong>Цел:</strong> Завръщане към тренировки (30+ кг) & планинско колоездене",
            en: "🎯 <strong>Goal:</strong> Return to heavy lifting (30kg+) & mountain biking"
        }
    },

    clinicalAlert: {
        title: {
            bg: "⚠️ Клинична находка: Липса на костно срастване (Non-Union)",
            en: "⚠️ Clinical Finding: Bone Non-Union / Pseudarthrosis"
        },
        content: {
            bg: "<strong>ЯМР (24 Юли 2025):</strong> Най-ранно доказателство за незарастване (фрактурни линии с дехисценция до 2.5 мм).<br><strong>КТ скенер (23 Апр 2026):</strong> Потвърждава хронична псевдоартроза (2 мм разстояние с изгладени костни ръбове) и два свободни ставни фрагмента (2 мм).",
            en: "<strong>MRI (24 July 2025):</strong> Earliest evidence of non-union (dehiscence gap up to 2.5 mm).<br><strong>CT Scan (23 Apr 2026):</strong> Confirms chronic pseudarthrosis (2 mm gap with smoothed bone edges) and two free 2 mm intra-articular fragments."
        }
    },

    navTabs: [
        { id: "sec-summary", bg: "Резюме", en: "Summary" },
        { id: "sec-studies", bg: "Изследвания", en: "Studies" },
        { id: "sec-timeline", bg: "Хронология", en: "Timeline" },
        { id: "sec-questions", bg: "Въпроси", en: "Questions" }
    ],

    summary: {
        injuryHistory: {
            title: {
                bg: "История на заболяването",
                en: "Injury & Rehab History"
            },
            content: {
                bg: "<strong>14 Май 2025 г.</strong> - Първоначална травма след падане от велосипед. Поставена гипсова лонгета с диагноза \"счупена глава на радиуса\".<br><br><strong>Юни 2025 г.</strong> - Сваляне на лонгетата (Ден 22) и започване на рехабилитация (движения за пронация/супинация, Артромот машина, плуване).<br><br><strong>Юли 2025 г.</strong> - ЯМР открива 2.5 мм незарастнал разрез. Одобрено е леко безболезнено натоварване.<br><br><strong>Септ 2025 - Март 2026 г.</strong> - Постепенно натоварване до 25 кг. Стабилност под товар, но с дефицит в пълното разгъване и лека периодична болка.<br><br><strong>13 Март 2026 г.</strong> - Втора травма (падане). Силен удар и болка, но рентгенът не отчита нова остра фрактура.<br><br><strong>23 Април 2026 г.</strong> - КТ скенер потвърждава хронична псевдоартроза и свободни вътреставни частици.",
                en: "<strong>May 14, 2025</strong> - Initial trauma from a bicycle fall. Plaster splint applied under \"fractured radial head\" diagnosis.<br><br><strong>June 2025</strong> - Splint removal (Day 22) and commencement of physical therapy (pronation/supination, Artromot machine, swimming).<br><br><strong>July 2025</strong> - MRI detects 2.5 mm unhealed cleft. Progressive pain-free load approved.<br><br><strong>Sep 2025 - Mar 2026</strong> - Loading increased gradually to 25 kg. Good stability under load, but persistent terminal extension deficit and occasional post-activity pain.<br><br><strong>March 13, 2026</strong> - Re-injury (fall). Severe strike and pain; standard X-rays rule out acute new fractures.<br><br><strong>April 23, 2026</strong> - CT scan confirms chronic pseudarthrosis and free intra-articular fragments."
            }
        },
        comparison: {
            title: {
                bg: "Сравнение на образните изследвания",
                en: "Comparative Scan Analysis"
            },
            headers: [
                {
                    bg: "Показател",
                    en: "Finding"
                },
                {
                    bg: "ЯМР (24.07.2025)",
                    en: "MRI (24.07.2025)"
                },
                {
                    bg: "КТ (23.04.2026)",
                    en: "CT (23.04.2026)"
                }
            ],
            rows: [
                {
                    finding: { bg: "Костно зарастване", en: "Bone Union" },
                    mri: { bg: "Дехисценция до 2.5 мм (начало на несъединяване).", en: "Dehiscence up to 2.5 mm (early non-union)." },
                    ct: { bg: "Дехисценция до 2 мм с изгладени костни краища (Хронична псевдоартроза).", en: "Dehiscence up to 2 mm with smoothed margins (Chronic pseudarthrosis).", danger: true }
                },
                {
                    finding: { bg: "Ставни фрагменти", en: "Loose Bodies" },
                    mri: { bg: "Не се наблюдават.", en: "None detected." },
                    ct: { bg: "Два свободни вътреставни фрагмента (~2 мм) медиално и дорзално.", en: "Two free intra-articular fragments (~2 mm) medially and dorsally.", warning: true }
                },
                {
                    finding: { bg: "Хрущял и Кисти", en: "Cartilage & Cysts" },
                    mri: { bg: "Нормална артикулация.", en: "Normal articulation." },
                    ct: { bg: "Ставни узури (ерозии) и малки кисти до 4 мм.", en: "Small articular usures (erosions) and cysts up to 4 mm." }
                }
            ]
        }
    },

    studies: {
        ct: {
            icon: "☢️",
            date: "23.04.2026",
            title: {
                bg: "КТ Скенер (23.04.2026)",
                en: "CT Scan (23.04.2026)"
            },
            description: {
                bg: "Потвърждава хронична псевдоартроза на радиусната глава с 2 мм процеп и два свободни вътреставни фрагмента.",
                en: "Confirms chronic pseudarthrosis of the radial head with a 2 mm gap and two free intra-articular fragments."
            },
            reportLink: {
                bg: "📄 Разчитане",
                en: "📄 Report"
            },
            viewOnline: {
                bg: "🩻 Виж КТ изследване",
                en: "🩻 View CT Scan"
            },
            dicomUrl: "https://www.dicomlibrary.com?study=1.3.6.1.4.1.44316.6.102.1.2026051715178511.599163768516177572070",
            pdfFile: "20260423_CT_Report.pdf",
            cardClass: "ct-card"
        },
        mri: {
            icon: "🩻",
            date: "24.07.2025",
            title: {
                bg: "ЯМР Изследване (24.07.2025)",
                en: "MRI Study (24.07.2025)"
            },
            description: {
                bg: "Най-ранно разкриване на незарастване (2.5 мм дехисценция) и деструкция на външните връзки (лигаменти).",
                en: "Earliest indication of non-union (2.5 mm cleft) and damage to lateral collateral complex."
            },
            reportLink: {
                bg: "📄 Разчитане",
                en: "📄 Report"
            },
            viewOnline: {
                bg: "🩻 Виж ЯМР изследване",
                en: "🩻 View MRI Scan"
            },
            dicomUrl: "https://www.dicomlibrary.com?study=1.3.6.1.4.1.44316.6.102.1.20260519103520833.49447669852157873244",
            pdfFile: "20250724_MRI_Boris_Simov.pdf",
            cardClass: "mri-card"
        },
        xrayArchive: {
            title: {
                bg: "Рентгенови снимки (Архив 2025)",
                en: "X-Ray Image Archives (2025)"
            },
            subtitle: {
                bg: "Контролни графии за проследяване на фрактурата и рехабилитацията.",
                en: "Check-up X-rays tracing bone healing and rehabilitation."
            },
            dates: [
                { id: "250711", date: "11.07.2025", label: { bg: "Ден 58 Контрола", en: "Day 58 Check-up" } },
                { id: "250610", date: "10.06.2025", label: { bg: "Ден 27 Контрола", en: "Day 27 Check-up" } },
                { id: "250523", date: "23.05.2025", label: { bg: "Ден 9 Контрола", en: "Day 9 Check-up" } },
                { id: "250515", date: "15.05.2025", label: { bg: "Ден 1 ВМА", en: "Day 1 VMA Check" } },
                { id: "250514", date: "14.05.2025", label: { bg: "Ден 0 (Инцидент)", en: "Day 0 (Fracture)" } }
            ]
        }
    },

    timeline: [
        {
            date: "23 Apr 2026",
            badge: "ct",
            badgeIcon: "☢️",
            title: {
                bg: "КТ Скенер (УМБАЛ \"Св. Анна\")",
                en: "CT Scan (St. Anna Hospital)"
            },
            viewIndicator: "CT Report",
            description: {
                bg: "<strong>Потвърдено незарастване:</strong> Хронична псевдоартроза на радиусната глава с 2 мм процеп, изгладени ръбове, узури и два свободни фрагмента (2 мм). <strong>Кликнете за преглед на PDF.</strong>",
                en: "<strong>Confirmed Non-Union:</strong> Chronic pseudarthrosis of the radial head with 2 mm gap, smoothed bone margins, usures, and two free 2 mm fragments. <strong>Click to load PDF.</strong>"
            },
            clickable: true,
            action: "loadPDF('CT')",
            panelClass: "ct-item"
        },
        {
            date: "13 Mar 2026",
            badge: "injury",
            badgeIcon: "⚠️",
            title: {
                bg: "Втора травма (падане)",
                en: "Second Trauma (Fall)"
            },
            description: {
                bg: "Падане с директен удар и силна болка в лакътя. Стандартната рентгенография изключва нова остра фрактура.",
                en: "Accidental fall with direct joint strike and acute pain. Standard X-rays rule out new acute fractures."
            }
        },
        {
            date: "Sep 2025 - Mar 2026",
            badge: "rehab",
            badgeIcon: "🏋️‍♂️",
            title: {
                bg: "Прогресивно силово натоварване",
                en: "Progressive Weight Training"
            },
            description: {
                bg: "Следване на лекарските съвети. Достигнати тежести до 25 кг. Стабилност под товар, но с дефицит в разгъването.",
                en: "Compliance with physician advice. Dumbbell presses up to 25 kg. Joint stable under load, with mild terminal extension blocks."
            }
        },
        {
            date: "24 Jul 2025",
            badge: "mri",
            badgeIcon: "🩻",
            title: {
                bg: "ЯМР Изследване (СМДЛ \"Спектър\")",
                en: "MRI Study (Spektr Laboratory)"
            },
            viewIndicator: "MRI Report",
            description: {
                bg: "<strong>Най-ранен сигнал за незарастване:</strong> Установени фрактурни линии с 2.5 мм дехисценция и частична увреда на латералния колатерален комплекс.",
                en: "<strong>Earliest evidence of non-union:</strong> Detects fracture lines with 2.5 mm cleft and partial tear of lateral collateral complex."
            },
            clickable: true,
            action: "loadPDF('MRI')",
            panelClass: "mri-item"
        },
        {
            date: "11 Jul 2025",
            badge: "x-ray",
            badgeIcon: "🩻",
            title: {
                bg: "Контролен рентген - Ден 58",
                en: "Pre-MRI X-ray - Day 58"
            },
            viewIndicator: "X-Ray",
            description: {
                bg: "Преглед при д-р Фирузи. Установена клинична нестабилност в лакътната става и назначаване на ЯМР.",
                en: "Consultation with Dr. Firuzi. Clinical elbow instability detected, leading to MRI scheduling."
            },
            clickable: true,
            action: "loadXrayDate('250711')"
        },
        {
            date: "10 Jun 2025",
            badge: "x-ray",
            badgeIcon: "🩻",
            title: {
                bg: "Контролен рентген - Ден 27",
                en: "Check-up X-ray - Day 27"
            },
            viewIndicator: "X-Ray",
            description: {
                bg: "Оценка на състоянието и проследяване на калусообразоването 5 дни след старта на раздвижването.",
                en: "Evaluating fracture status and callus formation 5 days post-splint removal."
            },
            clickable: true,
            action: "loadXrayDate('250610')"
        },
        {
            date: "05 Jun 2025",
            badge: "rehab",
            badgeIcon: "💪",
            title: {
                bg: "Сваляне на лонгета & Старт рехабилитация",
                en: "Splint Removal & Physical Therapy"
            },
            description: {
                bg: "Ден 22. Сваляне на гипса. Започване на активни упражнения за супинация, пронация, плуване.",
                en: "Day 22. Plaster removal. Initiation of physical therapy and range-of-motion movements."
            }
        },
        {
            date: "23 May 2025",
            badge: "x-ray",
            badgeIcon: "🩻",
            title: {
                bg: "Контролен рентген - Ден 9",
                en: "Check-up X-ray - Day 9"
            },
            viewIndicator: "X-Ray",
            description: {
                bg: "Наблюдение на фрактурата с шиниран лакът.",
                en: "Checking fracture alignment during active immobilization."
            },
            clickable: true,
            action: "loadXrayDate('250523')"
        },
        {
            date: "15 May 2025",
            badge: "x-ray",
            badgeIcon: "🩻",
            title: {
                bg: "Контролен рентген - Ден 1 (ВМА)",
                en: "Splint Check-up - Day 1 (VMA)"
            },
            viewIndicator: "X-Ray",
            description: {
                bg: "Втори ден след счупването. Нагласяне и проверка на гипсовата лонгета.",
                en: "First day post-injury. Alignment check of splinted limb."
            },
            clickable: true,
            action: "loadXrayDate('250515')"
        },
        {
            date: "14 May 2025",
            badge: "injury",
            badgeIcon: "⚠️",
            title: {
                bg: "Инцидент - Рентген (Ден 0)",
                en: "Incident - Emergency X-ray (Day 0)"
            },
            viewIndicator: "X-Ray",
            description: {
                bg: "Падане от велосипед. Диагностицирана фрактура на главичката на радиуса.",
                en: "Trauma from a bike crash. Standard diagnostics show radial head fracture."
            },
            clickable: true,
            action: "loadXrayDate('250514')"
        }
    ],

    questions: {
        doctorPanel: {
            title: {
                bg: "🩺 Информация за специалиста (незадължително)",
                en: "🩺 Clinician Information (optional)"
            },
            namePlaceholder: "Д-р Имe / Dr. Name",
            specialtyPlaceholder: "Специалност / Болница"
        },
        items: [
            {
                num: 1,
                text: {
                    bg: "Имам ли реално зарастване на радиуса и изграден костен мост (калус)? Какво означава текущото състояние за бъдещата функция на ръката ми?",
                    en: "Is there actual bone union and a formed callus bridge? What does the current status imply for my long-term arm function?"
                }
            },
            {
                num: 2,
                text: {
                    bg: "Вижда ли се на образните изследвания (ЯМР/КТ) сублуксация на ставата или разместване на някоя от костите?",
                    en: "Does either the MRI or CT show any joint subluxation or osseous displacement?"
                }
            },
            {
                num: 3,
                text: {
                    bg: "Имам ли скъсани лигаменти (връзки) и на какво точно се дължи усещането за нестабилност в лакътя?",
                    en: "Are there torn ligaments, and what is the pathological source of the elbow instability?"
                }
            },
            {
                num: 4,
                text: {
                    bg: "Каква е конкретната механична или биологична причина, която пречи на пълното разгъване на лакътя?",
                    en: "What is the mechanical or biological block preventing full elbow extension?"
                }
            },
            {
                num: 5,
                text: {
                    bg: "На какво се дължи прихрупващият звук, който усещам при специфични движения?",
                    en: "What causes the popping/clicking sound perceived during specific arm movements?"
                }
            },
            {
                num: 6,
                text: {
                    bg: "Защо се появява изпукващ звук при разгъване на лакътя след продължително сгъване?",
                    en: "Why does a cracking sound occur when extending the elbow after prolonged flexion?"
                }
            },
            {
                num: 7,
                text: {
                    bg: "Каква е причината за локализираните болки: от вътрешната страна на мишницата (над лакътя), над главичката на радиуса и по протежение на брахиорадиалиса?",
                    en: "What causes the focal pain localized on the medial upper arm (above the joint) and superior to the radial head/brachioradialis?"
                }
            },
            {
                num: 8,
                text: {
                    bg: "Можем ли да коментираме подробно находките от ЯМР и КТ и как те се промениха за последната година?",
                    en: "Can we detail the structural differences between the 2025 MRI and the 2026 CT scans and how they evolved?"
                }
            }
        ]
    },

    viewer: {
        welcome: {
            title: {
                bg: "🩺 Медицински панел за разглеждане",
                en: "🩺 Clinical Imaging & Report Panel"
            },
            description: {
                bg: "Кликнете върху събитие със син, зелен или оранжев знак в хронологията или списъка вляво, за да заредите съответните X-Ray снимки или PDF отчети на изследванията.",
                en: "Click on any timeline event with a blue, green, or orange indicator on the left side to load X-ray images, MRI, or CT reports here."
            }
        },
        defaultTitle: {
            bg: "Изберете изследване от хронологията вляво",
            en: "Select study from timeline to view"
        }
    },

    mobileNav: {
        dossier: {
            icon: "📋",
            bg: "Досие",
            en: "Dossier"
        },
        viewer: {
            icon: "🩻",
            bg: "Изследвания",
            en: "Viewer"
        }
    },

    autosave: {
        status: {
            idle: {
                bg: "Отговорите се записват автоматично",
                en: "Answers auto-save as you type"
            },
            saving: {
                bg: "⏳ Записване...",
                en: "⏳ Saving..."
            },
            saved: {
                bg: "✅ Записано",
                en: "✅ Saved"
            },
            error: {
                bg: "⚠️ Грешка при записване",
                en: "⚠️ Save error"
            }
        }
    }
};
