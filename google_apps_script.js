// ============================================================
// Google Apps Script - Автоматично записване на отговори
// Row-per-Answer модел + Password-protected session management
// ============================================================

const SPREADSHEET_ID = '1nhT7LpwEhlpdJFwpmxTbPYobmilgu2tWMz0RRtxKrbE';
const SHEET_NAME = 'Отговори';
const ACCESS_PASSWORD = '123';

// GET — list sessions, load session, or health check
function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action || 'health';
  const password = params.password || '';

  if (action === 'health') {
    return jsonResponse({ status: 'ok', message: 'Script is running.' });
  }

  if (password !== ACCESS_PASSWORD) {
    return jsonResponse({ status: 'error', message: 'Unauthorized' }, 403);
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ status: 'ok', sessions: [] });
    }

    const allData = sheet.getDataRange().getValues();
    const sessions = {};

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const sid = row[0];
      if (!sid) continue;

      if (!sessions[sid]) {
        sessions[sid] = {
          session_id: sid,
          consultation_date: row[2] || '',
          doctor_name: row[3] || '',
          specialty: row[4] || '',
          answers: [],
          last_modified: row[1] || ''
        };
      }

      if (row[5] && row[7] !== '') {
        sessions[sid].answers.push({
          question_num: row[5],
          question_text: row[6] || '',
          answer: row[7] || ''
        });
      }
    }

    if (action === 'list') {
      const sessionList = Object.values(sessions).map(s => ({
        session_id: s.session_id,
        consultation_date: s.consultation_date,
        doctor_name: s.doctor_name,
        specialty: s.specialty,
        answer_count: s.answers.filter(a => a.answer !== '').length,
        last_modified: s.last_modified
      }));
      sessionList.sort((a, b) => {
        if (a.consultation_date && b.consultation_date) return b.consultation_date.localeCompare(a.consultation_date);
        if (a.last_modified && b.last_modified) return new Date(b.last_modified) - new Date(a.last_modified);
        return 0;
      });
      return jsonResponse({ status: 'ok', sessions: sessionList });
    }

    if (action === 'load' && params.session_id) {
      const session = sessions[params.session_id];
      if (session) {
        return jsonResponse({ status: 'ok', session: session });
      }
      return jsonResponse({ status: 'error', message: 'Session not found' });
    }

    return jsonResponse({ status: 'error', message: 'Unknown action' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// POST — save answer OR load/list sessions
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'No post data received' });
    }

    const data = JSON.parse(e.postData.contents);
    if (!data) {
      return jsonResponse({ status: 'error', message: 'Invalid JSON' });
    }

    const action = data.action || 'save';
    const password = data.password || '';

    if (action === 'list' || action === 'load') {
      if (password !== ACCESS_PASSWORD) {
        return jsonResponse({ status: 'error', message: 'Unauthorized' }, 403);
      }
    }

    if (action === 'list') {
      return listSessions();
    }

    if (action === 'load') {
      return loadSession(data.session_id);
    }

    // Default: save
    return saveAnswer(data);

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function listSessions() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ status: 'ok', sessions: [] });
    }

    const allData = sheet.getDataRange().getValues();
    const sessions = {};

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const sid = row[0];
      if (!sid) continue;

      if (!sessions[sid]) {
        sessions[sid] = {
          session_id: sid,
          consultation_date: row[2] || '',
          doctor_name: row[3] || '',
          specialty: row[4] || '',
          answers: [],
          last_modified: row[1] || ''
        };
      }

      if (row[5] && row[7] !== '') {
        sessions[sid].answers.push({
          question_num: row[5],
          question_text: row[6] || '',
          answer: row[7] || ''
        });
      }
    }

    const sessionList = Object.values(sessions).map(s => ({
      session_id: s.session_id,
      consultation_date: s.consultation_date,
      doctor_name: s.doctor_name,
      specialty: s.specialty,
      answer_count: s.answers.filter(a => a.answer !== '').length,
      last_modified: s.last_modified
    }));
    sessionList.sort((a, b) => {
      if (a.consultation_date && b.consultation_date) return b.consultation_date.localeCompare(a.consultation_date);
      if (a.last_modified && b.last_modified) return new Date(b.last_modified) - new Date(a.last_modified);
      return 0;
    });
    return jsonResponse({ status: 'ok', sessions: sessionList });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function loadSession(sessionId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'No data sheet found' });
    }

    const allData = sheet.getDataRange().getValues();
    const session = {
      session_id: sessionId,
      consultation_date: '',
      doctor_name: '',
      specialty: '',
      answers: [],
      last_modified: ''
    };

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      if (row[0] !== sessionId) continue;

      if (!session.consultation_date && row[2]) session.consultation_date = row[2];
      if (!session.doctor_name && row[3]) session.doctor_name = row[3];
      if (!session.specialty && row[4]) session.specialty = row[4];
      if (!session.last_modified || row[1] > session.last_modified) session.last_modified = row[1];

      if (row[5] && row[7] !== '') {
        session.answers.push({
          question_num: row[5],
          question_text: row[6] || '',
          answer: row[7] || ''
        });
      }
    }

    if (session.answers.length === 0 && !session.doctor_name) {
      return jsonResponse({ status: 'error', message: 'Session not found' });
    }

    return jsonResponse({ status: 'ok', session: session });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

function saveAnswer(data) {
  const sessionId = data.session_id;
  const questionNum = data.question_num;
  const questionText = data.question_text || '';
  const answer = data.value || '';
  const consultationDate = data.consultation_date || '';
  const doctorName = data.doctor_name || '';
  const specialty = data.specialty || '';

  if (!sessionId || !questionNum) {
    return jsonResponse({ status: 'error', message: 'Missing session_id or question_num. Received: ' + JSON.stringify(data) });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Session ID', 'Timestamp', 'Дата консултация', 'Лекар / Д-р',
      'Специалност', 'Въпрос #', 'Текст на въпроса', 'Отговор'
    ]]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 120);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 140);
    sheet.setColumnWidth(5, 140);
    sheet.setColumnWidth(6, 70);
    sheet.setColumnWidth(7, 350);
    sheet.setColumnWidth(8, 500);
  }

  const allData = sheet.getDataRange().getValues();
  let rowIndex = -1;

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === sessionId && allData[i][5] == questionNum) {
      rowIndex = i + 1;
      break;
    }
  }

  const now = new Date();

  if (rowIndex === -1) {
    sheet.appendRow([sessionId, now, consultationDate, doctorName, specialty, questionNum, questionText, answer]);
    rowIndex = sheet.getLastRow();
  } else {
    sheet.getRange(rowIndex, 2).setValue(now);
    if (consultationDate) sheet.getRange(rowIndex, 3).setValue(consultationDate);
    if (doctorName) sheet.getRange(rowIndex, 4).setValue(doctorName);
    if (specialty) sheet.getRange(rowIndex, 5).setValue(specialty);
    if (questionText) sheet.getRange(rowIndex, 7).setValue(questionText);
    sheet.getRange(rowIndex, 8).setValue(answer);
  }

  return jsonResponse({ status: 'ok', session: sessionId, question_num: questionNum });
}

function jsonResponse(obj, code) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  if (code) {
    return output;
  }
  return output;
}
