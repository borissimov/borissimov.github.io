// ============================================================
// Google Apps Script - Автоматично записване на отговори
// Поставете този код в Apps Script и деплойнете като Web App
// ============================================================

// ── КОНФИГУРАЦИЯ ──────────────────────────────────────────
const SPREADSHEET_ID = '1nhT7LpwEhlpdJFwpmxTbPYobmilgu2tWMz0RRtxKrbE';
const SHEET_NAME = 'Отговори';
// ──────────────────────────────────────────────────────────

// Конфигурация на колоните в Google Sheets:
// A: Session ID  |  B: Дата/Час  |  C: Дата на консултация  |  D: Лекар/Д-р  |  E: Специалност
// F: Въпрос 1    |  G: Въпрос 2  |  H: Въпрос 3   |  I: Въпрос 4   |  J: Въпрос 5
// K: Въпрос 6    |  L: Въпрос 7  |  M: Въпрос 8   |  N: Въпрос 9   |  O: Въпрос 10
// P: Въпрос 11   |  Q: Въпрос 12 |  R: Въпрос 13

const COLUMN_MAP = {
  'name':              4,  // Колона D
  'specialty':         5,  // Колона E
  'consultation_date': 3,  // Колона C
  'q1':                6,  // Колона F
  'q2':                7,  // Колона G
  'q3':                8,  // Колона H
  'q4':                9,  // Колона I
  'q5':               10,  // Колона J
  'q6':               11,  // Колона K
  'q7':               12,  // Колона L
  'q8':               13,  // Колона M
  'q9':               14,  // Колона N
  'q10':              15,  // Колона O
  'q11':              16,  // Колона P
  'q12':              17,  // Колона Q
  'q13':              18  // Колона R
};

// Обработка на GET заявки (проверка дали скриптът работи)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Script is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Обработка на POST заявки (автоматично запазване на отговори)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sessionId = data.session_id;
    const field = data.field;
    const value = data.value;

    if (!sessionId || !field) {
      return errorResponse('Липсва session_id или field');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Създаване на листа ако не съществува
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Добавяме заглавния ред
      sheet.getRange(1, 1, 1, 18).setValues([[
        'Сесия ID', 'Последна промяна', 'Дата на консултация', 'Лекар / Д-р', 'Специалност',
        'Въпрос 1', 'Въпрос 2', 'Въпрос 3', 'Въпрос 4', 'Въпрос 5',
        'Въпрос 6', 'Въпрос 7', 'Въпрос 8', 'Въпрос 9', 'Въпрос 10',
        'Въпрос 11', 'Въпрос 12', 'Въпрос 13'
      ]]);
      // Форматиране на заглавния ред
      sheet.getRange(1, 1, 1, 18).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Намиране на съществуващ ред за тази сесия
    const allData = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === sessionId) {
        rowIndex = i + 1; // 1-индексиран ред в Sheets
        break;
      }
    }

    // Ако няма ред за тази сесия — създаваме нов
    if (rowIndex === -1) {
      const newRow = new Array(18).fill('');
      newRow[0] = sessionId;
      newRow[1] = new Date();
      sheet.appendRow(newRow);
      rowIndex = sheet.getLastRow();
    }

    // Записване на стойността в правилната колона
    const col = COLUMN_MAP[field];
    if (col) {
      sheet.getRange(rowIndex, col).setValue(value);
      // Актуализиране на времето на последна промяна
      sheet.getRange(rowIndex, 2).setValue(new Date());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', session: sessionId, field: field }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return errorResponse(err.message);
  }
}

function errorResponse(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
