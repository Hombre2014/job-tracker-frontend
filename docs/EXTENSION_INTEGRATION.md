# Extension Integration Setup

This document explains how to set up the frontend to receive full job descriptions from the Chrome Extension.

## Quick Start

### 1. Get Your Extension ID

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Find **Job Tracker Extension** in the list
4. Copy the **Extension ID** (long string below the extension name, e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 2. Configure Frontend

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your extension ID to `.env.local`:

   ```env
   NEXT_PUBLIC_EXTENSION_ID=your_extension_id_here
   ```

3. Restart the development server:

   ```bash
   npm run dev
   ```

### 3. Test It

1. Go to a LinkedIn job posting
2. Open the extension popup
3. Click "Quick Save" or "Customize"
4. The job should be created with the **full, untruncated description**!

## How It Works

### Extension Side

- Stores full job data in `chrome.storage.local` with a unique key
- Passes both old URL parameters (backward compatible) AND the storage key
- URL looks like: `?company=X&title=Y&description=...&jobDataKey=job_draft_123`

### Frontend Side

1. Checks for `jobDataKey` parameter in URL
2. If found, uses `chrome.runtime.sendMessage()` to retrieve full data from extension
3. Uses the full description from extension storage (no 1000-char limit!)
4. Falls back to URL parameters if extension communication fails

## Files Modified

- `lib/extensionBridge.ts` - NEW: Utility functions for extension communication
- `components/HomePage/Kanban/Column/BoardColumns.tsx` - Updated to retrieve full data
- `.env.example` - Added `NEXT_PUBLIC_EXTENSION_ID` configuration

## Troubleshooting

### "Extension bridge: Chrome runtime not available"

- **Cause**: Not running in browser or extension not installed
- **Solution**: Make sure extension is installed and you're testing in Chrome

### "Extension bridge: No extension ID provided"

- **Cause**: `NEXT_PUBLIC_EXTENSION_ID` not set in `.env.local`
- **Solution**: Follow steps 1-2 above to configure the extension ID

### Description still truncated to 1000 chars

- **Cause**: Extension ID not configured, so frontend falls back to URL parameters
- **Solution**: Set up `.env.local` with correct extension ID and restart dev server

### "Failed to retrieve from extension"

- **Cause**: Extension may have been reloaded/updated after storing the data
- **Solution**: This is expected if extension was reloaded. Try scraping a new job.

## Backward Compatibility

The system is **fully backward compatible**:

- ✅ Works WITHOUT extension ID configured (uses truncated 1000-char description)
- ✅ Works if extension communication fails (falls back to URL params)
- ✅ Works on production without extension installed (URL params only)

## Benefits

✅ **Full descriptions** - No more 1000-character truncation!
✅ **Secure** - One-time use, data auto-deleted after retrieval
✅ **Clean URLs** - Storage key is small, data doesn't bloat the URL
✅ **Backward compatible** - Works with or without extension ID configured
