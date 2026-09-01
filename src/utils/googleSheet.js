// 구글 스프레드시트 양방향 실시간 동기화 유틸리티
import { getGoogleWebhookUrl, mergeRemoteBookings } from './storage';

/**
 * 1. 신규 예약 신청 시 구글 스프레드시트로 전송 (생성/업데이트)
 */
export const sendToGoogleSheet = async (bookingData) => {
  const webhookUrl = getGoogleWebhookUrl();

  if (!webhookUrl) {
    return {
      success: true,
      mode: 'local-only',
      message: '로컬에 저장되었습니다. (구글 웹훅 URL 미설정)'
    };
  }

  try {
    const payload = {
      action: 'create',
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      id: bookingData.id,
      customerName: bookingData.customerName,
      phone: bookingData.phone,
      carModel: bookingData.carModelOnly || bookingData.carModel || '',
      carColor: bookingData.carColor || '',
      carYear: bookingData.carYear || '',
      serviceName: bookingData.serviceName,
      location: bookingData.location,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      notes: bookingData.notes || '없음',
      estimatedPrice: bookingData.estimatedPrice || 0,
      status: bookingData.status || '접수대기'
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      mode: 'google-synced',
      message: '구글 스프레드시트 및 로컬 시스템에 실시간 동기화되었습니다.'
    };
  } catch (error) {
    console.error('Google Sheet Sync Error:', error);
    return {
      success: false,
      mode: 'failed',
      message: '구글 시트 전송 중 통신 오류가 발생했습니다.'
    };
  }
};

/**
 * 2. 구글 스프레드시트에서 실시간 데이터 불러오기 (GET)
 */
export const fetchFromGoogleSheet = async () => {
  const webhookUrl = getGoogleWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: '웹훅 URL이 설정되지 않았습니다.', bookings: [] };
  }

  try {
    // GET 요청으로 구글 시트 데이터 취득
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.result === 'success' && Array.isArray(data.bookings)) {
      const merged = mergeRemoteBookings(data.bookings);
      return {
        success: true,
        count: data.bookings.length,
        bookings: merged,
        message: `구글 시트에서 ${data.bookings.length}건의 데이터를 실시간 동기화했습니다.`
      };
    } else {
      return {
        success: false,
        message: data.message || '구글 시트에서 데이터를 불러오지 못했습니다.',
        bookings: []
      };
    }
  } catch (err) {
    console.error('Failed to fetch from Google Sheet:', err);
    return {
      success: false,
      message: '구글 시트 실시간 데이터를 불러오는 중 통신 오류가 발생했습니다.',
      bookings: []
    };
  }
};

/**
 * 3. 관리자 대시보드에서 상태 변경 시 구글 시트 해당 행 실시간 업데이트
 */
export const updateGoogleSheetStatus = async (id, newStatus) => {
  const webhookUrl = getGoogleWebhookUrl();
  if (!webhookUrl || !id) return false;

  try {
    const payload = {
      action: 'updateStatus',
      id: id,
      status: newStatus
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (e) {
    console.error('Update status sync error:', e);
    return false;
  }
};

/**
 * 4. 관리자 대시보드에서 신청건 삭제 시 구글 시트 해당 행 실시간 삭제
 */
export const deleteFromGoogleSheet = async (id) => {
  const webhookUrl = getGoogleWebhookUrl();
  if (!webhookUrl || !id) return false;

  try {
    const payload = {
      action: 'delete',
      id: id
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (e) {
    console.error('Delete sync error:', e);
    return false;
  }
};

/**
 * 5. 최신 양방향 동기화 지원 Google Apps Script 코드
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================
 * [루멘 디테일링] 구글 스프레드시트 양방향 실시간 동기화 스크립트 (14개 열)
 * =========================================================================
 * 
 * [적용 방법]
 * 1. 구글 스프레드시트 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 스크립트 전체를 복사/붙여넣기 후 저장(Ctrl+S)
 * 3. 우측 상단 [배포] -> [새 배포] 클릭
 * 4. 유형: [웹 앱] 선택
 *    - 설명: 출장차량관리 양방향 실시간 동기화
 *    - 다음 사용자로 실행: 나(내 계정)
 *    - 액세스 권한: 모든 사용자 (Anyone)  <-- 필수!
 * 5. [배포] 클릭 후 생성된 [웹 앱 URL]을 복사하여 관리자 페이지에 등록하세요.
 */

// 1. 웹 관리자 대시보드로 구글 시트 전체 데이터를 실시간 제공 (GET)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    ensureHeader(sheet);
    
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "count": 0, "bookings": [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var values = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
    var bookings = [];
    
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      var id = row[1] ? String(row[1]).trim() : "";
      if (!id && !row[2] && !row[3]) continue; // 빈 행 건너뜀
      
      var carModel = String(row[4] || "").trim();
      var carColor = String(row[5] || "").trim();
      var carYear = String(row[6] || "").trim();
      var fullCar = carModel;
      if (carColor && !fullCar.includes(carColor)) fullCar += " " + carColor;
      if (carYear && !fullCar.includes(carYear)) fullCar += " (" + carYear + ")";
      
      bookings.push({
        id: id || ("BK-" + (i + 1)),
        createdAt: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ""),
        customerName: String(row[2] || ""),
        phone: String(row[3] || ""),
        carModelOnly: carModel,
        carColor: carColor,
        carYear: carYear,
        carModel: fullCar.trim(),
        serviceName: String(row[7] || ""),
        location: String(row[8] || ""),
        preferredDate: row[9] instanceof Date ? Utilities.formatDate(row[9], "Asia/Seoul", "yyyy-MM-dd") : String(row[9] || ""),
        preferredTime: String(row[10] || ""),
        estimatedPrice: Number(row[11]) || 0,
        notes: String(row[12] || ""),
        status: String(row[13] || "접수대기")
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "count": bookings.length,
      "bookings": bookings
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. 웹에서 등록/수정/삭제 시 구글 시트에 실시간 반영 (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    ensureHeader(sheet);
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (ex) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
    
    var action = data.action || 'create';
    var targetId = (data.id || "").trim();
    var lastRow = sheet.getLastRow();
    
    // [동작 1] 행 삭제 (DELETE)
    if (action === 'delete' && targetId) {
      for (var r = 2; r <= lastRow; r++) {
        var rowId = String(sheet.getRange(r, 2).getValue()).trim();
        if (rowId === targetId) {
          sheet.deleteRow(r);
          return ContentService.createTextOutput(JSON.stringify({ "result": "success", "action": "deleted", "id": targetId }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ "result": "not_found", "id": targetId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // [동작 2] 상태 변경 (UPDATE STATUS)
    if (action === 'updateStatus' && targetId) {
      for (var r = 2; r <= lastRow; r++) {
        var rowId = String(sheet.getRange(r, 2).getValue()).trim();
        if (rowId === targetId) {
          sheet.getRange(r, 14).setValue(data.status || "접수대기");
          return ContentService.createTextOutput(JSON.stringify({ "result": "success", "action": "status_updated", "id": targetId, "status": data.status }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // [동작 3] 신규 등록 또는 전체 갱신 (CREATE / UPDATE)
    var existingRow = -1;
    if (targetId && lastRow >= 2) {
      var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var j = 0; j < ids.length; j++) {
        if (String(ids[j][0]).trim() === targetId) {
          existingRow = j + 2;
          break;
        }
      }
    }
    
    var rowValues = [
      data.timestamp || new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.id || ("BK-" + Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMdd") + "-" + Math.floor(100 + Math.random() * 900)),
      data.customerName || "",
      data.phone || "",
      data.carModel || data.carModelOnly || "",
      data.carColor || "",
      data.carYear || "",
      data.serviceName || "",
      data.location || "",
      data.preferredDate || "",
      data.preferredTime || "",
      data.estimatedPrice || 0,
      data.notes || "",
      data.status || "접수대기"
    ];
    
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, 14).setValues([rowValues]);
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "action": "updated", "id": targetId }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      sheet.appendRow(rowValues);
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "action": "created", "id": targetId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 3. 헤더 행 보장 함수
function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "접수일시", "접수번호", "고객명", "연락처", 
      "차종(모델)", "차량 색상", "차량 연식", 
      "희망 시공 서비스", "출장 희망 주소", "희망 일자", "희망 시간", 
      "예상 견적(원)", "고객 요청사항", "진행 상태"
    ]);
    sheet.getRange(1, 1, 1, 14).setBackground("#0b0f17").setFontColor("#38bdf8").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}
`;

