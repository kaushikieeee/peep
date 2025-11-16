# Secure Google Sheets Database - Quick Setup

## What Was Built

Your Peep app now has:

1. **Dynamic Data Fetching** - All providers and problems pulled from Google Sheets
2. **Secure Admin Editing** - Edit everything directly from the admin panel on your website
3. **Server-Side Protection** - All updates processed securely on the backend
4. **No External Links** - Users never leave your site to edit data

## Files Created

```
lib/
  ├── googleSheetsServerClient.ts  (server-side API for writing to sheets)
  └── sheetClientAPI.ts            (client-side helpers for API calls)

app/
  └── api/
      └── admin/
          └── sheets/
              └── route.ts          (secure API endpoint)

components/
  └── admin/
      ├── provider-editor.tsx       (edit/add providers form)
      └── problem-editor.tsx        (edit/add problems form)

app/admin/marketplace/page.tsx       (updated admin dashboard)
```

## Quick Start

### 1. Install Dependencies
Already done - `googleapis` installed

### 2. Get Service Account Credentials
Visit: https://console.cloud.google.com
- Create/select project
- Enable Google Sheets API
- Create Service Account
- Download JSON key

### 3. Update `.env.local`

```env
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1IRDxPqcjRroM6TkAONKuiTWjeLCBtK-vlrHCcLsHnxw
GOOGLE_SHEETS_ID=1IRDxPqcjRroM6TkAONKuiTWjeLCBtK-vlrHCcLsHnxw
GOOGLE_SHEETS_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_API_TOKEN=your-random-secure-token
NEXT_PUBLIC_API_TOKEN=your-random-secure-token
```

### 4. Share Sheet with Service Account
- Open your Google Sheet
- Click Share
- Add the service account email
- Give "Editor" access

### 5. Verify Sheet Structure
Your sheet should have two tabs named exactly:
- `providers` - with headers: id, name, service, rating, reviews, estimate, specialties, responseTime, availability, email, phone, location, experience, certification, insurance, portfolio, successRate
- `problems` - with headers: id, title, location, latitude, longitude, severity, category, description, reportedBy, reportedDate, status, priority, estimatedCost, deadline, images, tags

### 6. Test It
1. Go to `/admin/marketplace` (login with admin@peep.com / admin123)
2. Click "Add Provider" or "Add Problem"
3. Fill in details and save
4. Check your Google Sheet - data should appear there!
5. Click Refresh - new data loads from sheet

## How Security Works

```
User edits data in admin panel
         ↓
Client sends to /api/admin/sheets
         ↓
Server verifies auth token
         ↓
Server uses Service Account to write to Google Sheets
         ↓
Google Sheets updated (source of truth)
         ↓
Client refreshes - fetches from sheets
```

## Admin Dashboard Features

### Providers Tab
- ✅ View all providers in grid
- ✅ Click edit button to modify
- ✅ Add new provider with + button
- ✅ Delete provider
- ✅ All fields editable

### Problems Tab
- ✅ View all problems in list
- ✅ Click edit to change details
- ✅ Add new problem with + button
- ✅ Delete problem
- ✅ Manage tags and images

## What Happens When You Edit

1. **Click Edit** → Modal form opens with current data
2. **Make changes** → Form validates locally
3. **Click Save** → Sends to `/api/admin/sheets`
4. **Server processes** → Validates token, updates sheet
5. **Data syncs** → Public fetch API gets new data
6. **UI updates** → Admin panel refreshes

## Important Security Notes

⚠️ **Before going to production:**
1. Change the default admin password (`admin@peep.com / admin123`)
2. Generate proper authentication tokens
3. Implement session management (JWT/NextAuth)
4. Add rate limiting
5. Log admin actions
6. Use HTTPS only

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Unauthorized" error | Check API token in `.env.local` |
| Changes don't appear | Verify service account has editor access |
| "Sheet not found" | Tab names must be exact: "providers" and "problems" |
| Permission denied | Share sheet with service account email |

## Next: Enhance Authentication

For production, update `/app/admin/login/page.tsx` to use:
- Environment variable credentials
- JWT tokens
- NextAuth.js for session management
- Database for user accounts

See `/GOOGLE_SHEETS_SETUP.md` for detailed guide.
