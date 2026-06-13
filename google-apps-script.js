/**
 * 24K Realty - Google Sheets Lead Capture Integration
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1_rAS7Kz2Nqysguee5QeYCPOD6nWCPkSTA-cMsfxMelE/edit?usp=sharing
 * 2. In the top menu, go to "Extensions" > "Apps Script".
 * 3. Delete any code in the editor, and paste this entire code script.
 * 4. Click the Save button (floppy disk icon).
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type", choose "Web app".
 * 7. Set:
 *    - Description: "24K Realty Form Integration"
 *    - Execute as: "Me (your email address)"
 *    - Who has access: "Anyone"
 * 8. Click "Deploy", then authorize permissions (click "Advanced" and "Go to Untitled project (unsafe)" to allow access).
 * 9. Copy the generated Web App URL and paste it in `assets/js/main.js` at the top.
 */

function doGet(e) {
  return ContentService.createTextOutput("24K Realty Google Sheet Integration Web App is running successfully!");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for lock to avoid conflicts
  
  try {
    // Open the Google Sheet using your specific Spreadsheet ID
    var doc = SpreadsheetApp.openById('1_rAS7Kz2Nqysguee5QeYCPOD6nWCPkSTA-cMsfxMelE');
    var sheet = doc.getSheets()[0]; // Use the first sheet tab
    
    var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    
    // If sheet is completely empty, set default headers
    if (sheet.getLastColumn() === 0 || headers[0] === "") {
      headers = [
        'Timestamp', 
        'Form Type', 
        'Property / Service', 
        'Name', 
        'Email Address', 
        'Phone Number', 
        'Preferred Day / Interest', 
        'Message / Requirements'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    var row = [];
    var data = {};
    
    // Parse form parameters
    if (e.parameter) {
      for (var key in e.parameter) {
        data[key] = e.parameter[key];
      }
    }
    
    // Parse JSON body if sent as text/plain or application/json
    if (e.postData && e.postData.contents) {
      try {
        var json = JSON.parse(e.postData.contents);
        for (var key in json) {
          data[key] = json[key];
        }
      } catch (err) {
        // Fallback for form-urlencoded text
        var parts = e.postData.contents.split('&');
        for (var i = 0; i < parts.length; i++) {
          var pair = parts[i].split('=');
          if (pair.length === 2) {
            data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
          }
        }
      }
    }
    
    // Map data fields to headers dynamically
    for (var i = 0; i < headers.length; i++) {
      var headerName = headers[i].toString().trim();
      if (headerName.toLowerCase() === 'timestamp') {
        row.push(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})); // Store local IST time
      } else {
        var matchedVal = '';
        for (var key in data) {
          if (isMatch(key, headerName)) {
            matchedVal = data[key];
            break;
          }
        }
        row.push(matchedVal);
      }
    }
    
    // Append the row
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'row': nextRow
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*'); // Enable CORS response
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  } finally {
    lock.releaseLock();
  }
}

// Function to map incoming form keys to Google Sheet headers dynamically
function isMatch(key, header) {
  var k = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  var h = header.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (k === h) return true;
  
  // Logical match combinations
  if (k === 'name' && h.indexOf('name') > -1) return true;
  if (k === 'email' && h.indexOf('email') > -1) return true;
  if (k === 'phone' && h.indexOf('phone') > -1) return true;
  if (k === 'tel' && h.indexOf('phone') > -1) return true;
  if (k === 'mobile' && h.indexOf('phone') > -1) return true;
  if (k === 'interest' && h.indexOf('interest') > -1) return true;
  if (k === 'interest' && h.indexOf('property') > -1) return true;
  if (k === 'property' && h.indexOf('property') > -1) return true;
  if (k === 'message' && h.indexOf('message') > -1) return true;
  if (k === 'message' && h.indexOf('requirements') > -1) return true;
  if (k === 'requirements' && h.indexOf('message') > -1) return true;
  if (k === 'formtype' && h.indexOf('form') > -1) return true;
  if (k === 'preferredday' && h.indexOf('day') > -1) return true;
  if (k === 'preferredday' && h.indexOf('interest') > -1) return true;
  
  return false;
}
