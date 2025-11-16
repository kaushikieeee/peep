# Google Sheets Secure Database Setup

Your admin panel can now edit all data directly from the website. Here's what's been set up:

## Features Implemented

✅ **Dynamic fetching** from your Google Sheet "peepindia"
✅ **Secure server-side editing** - all updates happen on the backend
✅ **Admin panel UI** - edit providers and problems from the site
✅ **Real-time updates** - changes sync instantly
✅ **Add/Edit/Delete** operations for both providers and problems

## Setup Instructions

### Step 1: Create a Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Sheets API**:
   - Search for "Google Sheets API" 
   - Click Enable
4. Create a Service Account:
   - Go to Credentials → Create Credentials → Service Account
   - Fill in account details
   - Grant it "Editor" role (or "Can edit" on the spreadsheet)
   - Click "Create and Continue"
5. Create a Key:
   - Go to Keys tab
   - Click "Add Key" → Create new key → JSON
   - Save the JSON file securely

### Step 2: Configure Environment Variables

Open `.env.local` and fill in:

```
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_API_TOKEN=generate-a-random-secure-token-here
NEXT_PUBLIC_API_TOKEN=same-token-as-above
```

From the JSON key file:
- Copy `client_email` 
- Copy `private_key` (the entire multi-line value, keeping the `\n` escape sequences)

### Step 3: Share Sheet with Service Account

1. Open your Google Sheet "peepindia"
2. Click Share
3. Add the service account email (from `client_email`)
4. Give it "Editor" access
5. Uncheck "Notify people"

### Step 4: Set Up Sheet Tabs

Your Google Sheet should have these tabs:

**Sheet 1: "providers"**
Headers (Row 1):
```
id, name, service, rating, reviews, estimate, specialties, responseTime, availability, email, phone, location, experience, certification, insurance, portfolio, successRate
```

**Sheet 2: "problems"**
Headers (Row 1):
```
id, title, location, latitude, longitude, severity, category, description, reportedBy, reportedDate, status, priority, estimatedCost, deadline, images, tags
```

### Step 5: Generate Secure API Token

Run this in your terminal to generate a secure random token:

```bash
openssl rand -base64 32
```

Use the output for both `ADMIN_API_TOKEN` and `NEXT_PUBLIC_API_TOKEN`

## How It Works

1. **Client-side**: Users see the admin panel and edit forms
2. **Server-side API** (`/api/admin/sheets`):
   - Verifies admin authentication
   - Validates the API token
   - Uses Google Sheets API to update data
   - Returns secure responses
3. **Google Sheets**: Data is stored in your sheet as the source of truth
4. **Fetching**: Public read access through Visualization API (no auth needed)
5. **Editing**: Server-side only with admin credentials

## Admin Panel

Access at: `/admin/marketplace`

Login with:
- Email: `admin@peep.com`
- Password: `admin123`

(Update these in `/app/admin/login/page.tsx` for production)

## Features in Admin Panel

### Providers Tab
- View all service providers
- Add new provider
- Edit existing provider details
- Delete providers
- Fields: name, service, rating, cost, specialties, contact info, etc.

### Problems Tab
- View all pollution problems
- Add new problem report
- Edit problem details (status, severity, assignments)
- Delete problems
- Fields: location, category, severity, status, images, tags, etc.

## Security Notes

⚠️ **Important for Production**:
1. Change admin login credentials (currently `admin@peep.com / admin123`)
2. Use environment variables for all secrets
3. Implement proper session management (consider NextAuth.js)
4. Add rate limiting to the API
5. Log all admin actions for audit trail
6. Use HTTPS only
7. Implement proper role-based access control

## Troubleshooting

### "Unauthorized" error
- Check `ADMIN_API_TOKEN` matches in both `.env.local` and code
- Verify admin is logged in (`localStorage.getItem('admin-auth')`)

### "Sheet not found" error
- Verify sheet tab names are exactly: "providers" and "problems"
- Check `GOOGLE_SHEETS_ID` is correct

### "Permission denied" error
- Share the sheet with the service account email
- Give it "Editor" access
- Wait a few moments for permissions to propagate

### Data not updating
- Check browser console for errors
- Verify Google Sheets API is enabled in Cloud Console
- Check service account has editor access to the sheet

## Next Steps

1. Complete the setup steps above
2. Test by adding a provider from the admin panel
3. Verify it appears in your Google Sheet
4. Check that refresh shows new data
5. Update authentication for production use
