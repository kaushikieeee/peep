# Evidence Management - Quick Start Guide

## Accessing Evidence Management
Navigate to `/admin/evidence` to access the Evidence Management dashboard.

## Dashboard Overview

### Statistics Panel (Top)
Displays real-time statistics:
- **Total**: Total number of evidence items
- **Verified**: Items marked as verified
- **Unverified**: Items pending verification
- **High Sev**: High severity items
- **Med Sev**: Medium severity items
- **Low Sev**: Low severity items
- **w/ Images**: Evidence with attached images
- **Upvotes**: Total community upvotes

### Filtering & Search

#### Search Box
- Type to search evidence by:
  - Evidence ID
  - Reporter name
  - Description/notes

#### Filter Dropdowns
1. **Category**: Filter by evidence type (Pothole, Drainage, Street Light, etc.)
2. **Severity**: Show Low, Medium, or High severity items
3. **Zone**: Filter by geographic zone
4. **Status**: Show Verified or Unverified items
5. **Sort By**: 
   - Latest First: Most recent evidence first
   - Oldest First: Oldest evidence first
   - Highest Severity: Most severe issues first
   - Most Upvotes: Most supported evidence first

## Evidence Card Features

### Visual Indicators
- **Severity Badge**: Color-coded (Red=High, Orange=Medium, Green=Low)
- **Category Tag**: Blue badge showing evidence type
- **Zone Tag**: Purple badge showing location
- **Verified Badge**: Green badge if verified
- **Image Indicator**: Shows number of attached images (📷 X)

### Card Actions

#### View Images
Click the **👁️ Eye icon** to preview images associated with the evidence
- Use arrow buttons to navigate between images
- Close with X button

#### Edit Evidence
Click the **✏️ Edit icon** to modify:
- Description
- Category
- Severity
- Additional details
- Images

#### Escalate to Authority
Click the **⚠️ Alert icon** to escalate unverified evidence
- Choose receiving authority (Municipal Corp, PWD, Health Dept, etc.)
- Add optional message
- Evidence converted to problem record
- Tracked for follow-up

## Bulk Operations

### Selecting Items
1. **Check individual items** using checkboxes on each card
2. **Select all filtered items** using the checkbox in the bulk action bar

### Bulk Action Bar
Appears when 1+ items selected. Shows:
- Count of selected items
- **Verify Button**: Mark all selected items as verified
- **Delete Button**: Remove all selected items

### Confirmation Dialogs
- Verify: Simple confirmation
- Delete: Warning that action cannot be undone (requires confirmation)

## Common Workflows

### Verify Multiple Evidence Items
1. Open Evidence Management page
2. Browse or filter to find items
3. Check the checkbox for each item to verify
4. When ready, click **"✓ Verify"** in the bulk action bar
5. Confirm the action
6. Items marked as verified

### Escalate High Severity Issue
1. Find the evidence item
2. Click the **⚠️ Alert icon** on the card
3. Select appropriate authority:
   - Municipal Corporation (street level)
   - Public Works (infrastructure)
   - Public Health (sanitation)
   - Water Board (water/sewage)
4. Add a message describing the escalation
5. Click "Escalate"
6. Confirmation shown with Problem ID

### Find Evidence by Reporter
1. Type reporter name in Search box
2. Results filter in real-time
3. View all evidence from that reporter

### Filter by Severity & Zone
1. Use **Severity** dropdown to select High/Medium/Low
2. Use **Zone** dropdown to select area
3. List updates to show only matching items
4. Clear filters to reset

### Delete Multiple Items
1. Select items using checkboxes
2. Click **"Delete"** in bulk action bar
3. Confirm deletion (cannot be undone)
4. Items removed from system

## Tips & Best Practices

✅ **Do:**
- Use filters to focus on specific issues
- Escalate high-severity items promptly
- Review and verify community evidence
- Sort by upvotes to find most-supported issues
- Use search to find specific items quickly

❌ **Don't:**
- Bulk delete without reviewing carefully
- Mark unverified evidence as verified without checking
- Escalate without selecting an authority
- Forget to add context in escalation messages

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Items not loading | Refresh the page, check internet connection |
| Filters not working | Clear all filters and try again |
| Escalation failed | Ensure authority is selected and message is added |
| Checkboxes not responding | Try refreshing the page |
| Stats showing old numbers | Close and reopen the page |

## Role-Based Access

This interface is for **Admin Users Only**:
- Must be logged in as admin
- Session timeout: As configured in admin settings
- Logout available in top-right corner

## Data Privacy

Evidence Management:
- ✓ Displays public evidence submissions
- ✓ Reporter information visible to admins
- ✓ Location data accessible
- ✓ All actions logged and auditable

---

For additional help, contact your system administrator.
