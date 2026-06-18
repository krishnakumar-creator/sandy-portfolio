# How to Setup Contact Form → Google Sheets

This guide connects the contact form on your portfolio to a **"Contact Responses"** tab in your existing Google Sheet (the same one used for posters).

---

## Step 1: Create the "Contact Responses" Tab

1. Open your Google Sheet (the one with poster data).
2. Click the **+** button at the bottom-left to add a new sheet tab.
3. Rename the tab to exactly: **Contact Responses**
4. In row 1, add these column headers:

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | First Name | Last Name | Email | Message |

---

## Step 2: Add the Google Apps Script

1. In the same Google Sheet, go to **Extensions → Apps Script**.
2. Delete any existing code in the editor.
3. Paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contact Responses');

    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Contact Responses');
      sheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Email', 'Message']);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.first_name || '',
      data.last_name || '',
      data.email || '',
      data.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon) and name the project something like "Contact Form Handler".

---

## Step 3: Deploy as a Web App

1. Click **Deploy → New deployment** (top-right).
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Set the following:
   - **Description**: Contact Form Handler
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. **Authorize** the script when prompted (click "Review Permissions" → choose your account → "Allow").
6. Copy the **Web app URL** that appears. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## Step 4: Paste the URL in Your Code

1. Open `main.js` in your project.
2. Find this line near the top:
   ```javascript
   const GOOGLE_SHEET_FORM_URL = '';
   ```
3. Paste your Web App URL between the quotes:
   ```javascript
   const GOOGLE_SHEET_FORM_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file.

---

## That's it! 🎉

When someone fills out the contact form on your portfolio:
- The data is sent directly to Google Sheets.
- A new row appears in the **"Contact Responses"** tab with:
  - Timestamp (IST)
  - First Name
  - Last Name
  - Email
  - Message

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Form says "not configured" | Make sure `GOOGLE_SHEET_FORM_URL` is not empty in `main.js` |
| No rows appearing in sheet | Check that the tab is named exactly **Contact Responses** |
| Authorization error | Re-deploy: **Deploy → Manage deployments → Edit → New version → Deploy** |
| Changed the script? | You must create a **new version** when redeploying for changes to take effect |
