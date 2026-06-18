# How to Upload & Manage Posters

Your portfolio loads posters dynamically from a **Google Sheet**. You can add, remove, or reorder posters anytime — no code changes needed.

---

## Your Google Sheet Setup

Your posters are managed in the same Google Sheet that's already connected. The sheet should have these columns:

| Title | Tag | Image | Alt Text |
|-------|-----|-------|----------|
| *(any text)* | *(any text)* | **⬅ This is the important one** | *(any text)* |

> **Only the "Image" column matters** for display. Title, Tag, and Alt Text are kept for your own reference but won't appear on the website.

---

## How to Add a New Poster

### Option A: Using Google Drive (Recommended)

1. **Upload your poster image** to Google Drive.
2. **Right-click** the file → **Share** → Set to **"Anyone with the link"** → Copy link.
3. Open your Google Sheet and **add a new row**.
4. Paste the Google Drive link in the **Image** column.

**Example row:**

| Title | Tag | Image | Alt Text |
|-------|-----|-------|----------|
| My New Poster | Design | `https://drive.google.com/file/d/1ABC.../view?usp=sharing` | New poster |

The website automatically converts Google Drive share links to direct image URLs.

### Option B: Using Direct Image URLs

You can also use any direct image URL (from Imgur, Cloudinary, etc.):

| Title | Tag | Image | Alt Text |
|-------|-----|-------|----------|
| My New Poster | Design | `https://i.imgur.com/example.jpg` | New poster |

---

## How to Remove a Poster

Simply **delete the row** from the Google Sheet. The poster will disappear from the website on the next page load.

---

## How to Reorder Posters

**Drag and rearrange the rows** in Google Sheet. The posters display in the same order as the rows (top row = first poster shown).

---

## Supported Image Formats

- PNG, JPG, JPEG, WebP
- Any aspect ratio works — the slider auto-adapts to **1:1**, **4:5**, **9:16**, etc.
- For best quality, use images **at least 800px** on the shortest side.

---

## Important Notes

| Topic | Detail |
|-------|--------|
| **Changes go live automatically** | No deployment needed — just edit the sheet and refresh the website |
| **Google Drive links** | Make sure sharing is set to **"Anyone with the link"** or the image won't load |
| **Minimum posters** | Have at least **3 posters** for the 3D slider to look good |
| **Sheet must stay published** | Don't unpublish the Google Sheet or posters will stop loading |

---

## Where Is the Google Sheet URL Configured?

In `main.js`, line 2:

```javascript
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv';
```

If you ever need to switch to a different Google Sheet, replace this URL with the new sheet's **published CSV link**:
1. Open the new Google Sheet → **File → Share → Publish to web**
2. Choose **Entire document** → **CSV** format
3. Click **Publish** and copy the URL

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Poster not showing | Check that the Google Drive sharing is set to "Anyone with the link" |
| Broken image | Make sure the URL is correct and the image file exists |
| No posters loading | Verify the Google Sheet is still published (File → Share → Publish to web) |
| Old posters still showing | Hard refresh the browser with `Ctrl + Shift + R` |
| Poster looks cropped | It shouldn't — the slider auto-adapts. Try a different browser if it looks off |
