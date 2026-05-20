// ============================================================
// Google Apps Script - Автоматично записване на отговори
// Поставете този код в Apps Script и деплойнете като Web App
// ============================================================

// Конфигурация на колоните в Google Sheets:
// A: Session ID  |  B: Дата/Час  |  C: Лекар/Д-р  |  D: Специалност
// E: Въпрос 1    |  F: Въпрос 2  |  G: Въпрос 3   |  H: Въпрос 4
// I: Въпрос 5    |  J: Въпрос 6  |  K: Въпрос 7   |  L: Въпрос 8

const SHEET_NAME = 'Отговори'; // Името на листа в Google Sheets

const COLUMN_MAP = {
  'name':       3,  // Колона C
  'specialty':  4,  // Колона D
  'q1':         5,  // Колона E
  'q2':         6,  // Колона F
  'q3':         7,  // Колона G
  'q4':         8,  // Колона H
  'q5':         9,  // Колона I
  'q6':         10, // Колона J
  'q7':         11, // Колона K
  'q8':         12  // Колона L
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

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Създаване на листа ако не съществува
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Добавяме заглавния ред
      sheet.getRange(1, 1, 1, 12).setValues([[
        'Сесия ID', 'Последна промяна', 'Лекар / Д-р', 'Специалност',
        'Въпрос 1', 'Въпрос 2', 'Въпрос 3', 'Въпрос 4',
        'Въпрос 5', 'Въпрос 6', 'Въпрос 7', 'Въпрос 8'
      ]]);
      // Форматиране на заглавния ред
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
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
      const newRow = new Array(12).fill('');
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
