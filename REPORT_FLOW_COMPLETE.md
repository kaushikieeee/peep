# Report Flow Structure - Complete Documentation

## ✅ Implemented 7-Step Multi-Step Reporting Flow

The report flow has been successfully restructured with proper folder-based routing and a cohesive black-themed UI with glassmorphism effects.

## 📱 Flow Overview

```
Step 1: Location Capture
└─ /peep/user/report-flow/page.tsx
   - Auto-detect geolocation OR manual search
   - Stores: peep-report-lat, peep-report-lng
   - Progress: 1/7

Step 2: Capture Photo
└─ /peep/user/report-flow/capture-photo/page.tsx
   - Take photo with camera OR upload from gallery
   - Stores: peep-report-photo
   - Progress: 2/7

Step 3: Add Title
└─ /peep/user/report-flow/add-title/page.tsx
   - Enter title (max 100 chars)
   - Stores: peep-report-title
   - Progress: 3/7

Step 4: Select Category
└─ /peep/user/report-flow/select-category/page.tsx
   - Choose from 6 predefined categories
   - Categories: Soil contamination, Stagnant water, Plastic/microplastics, Damaged turf, Waste dumping, Other
   - Stores: peep-report-category
   - Progress: 4/7

Step 5: Set Severity
└─ /peep/user/report-flow/set-severity/page.tsx
   - Select severity level: Low, Medium, High
   - Stores: peep-report-severity
   - Progress: 5/7

Step 6: Describe Issue
└─ /peep/user/report-flow/describe-issue/page.tsx
   - Detailed description (max 200 chars)
   - Stores: peep-report-description
   - Progress: 6/7

Step 7: Confirm & Submit
└─ /peep/user/report-flow/confirm-submit/page.tsx
   - Review all collected data
   - Display severity score
   - Optional: Enter reporter name
   - Submit to /api/evidence/submit
   - Clears all sessionStorage on success
   - Progress: 7/7
```

## 🎨 Design Features

### Black Background Theme
- All pages use `bg-black` with `text-white`
- Consistent dark theme throughout the flow

### Glassmorphism Effects
- Headers: `backdrop-blur-xl bg-white/10 border-b border-white/10`
- Cards: `backdrop-blur-xl bg-white/10 border border-white/20`
- Progress bars: 7-step horizontal progress indicator

### Navigation
- Back button on each step (except first)
- Continue/Next buttons for forward progression
- Session storage persistence across steps
- Clear data collection at final submission

## 📊 Session Storage Keys

```javascript
peep-report-lat          // Location latitude
peep-report-lng          // Location longitude
peep-report-photo        // Base64 encoded photo
peep-report-title        // Report title (100 chars max)
peep-report-category     // Selected category
peep-report-severity     // Severity level (Low/Medium/High)
peep-report-description  // Issue description (200 chars max)
```

## 🔄 Data Flow

1. **Location** → SessionStorage (lat/lng)
2. **Photo** → SessionStorage (photo)
3. **Title** → SessionStorage (title)
4. **Category** → SessionStorage (category)
5. **Severity** → SessionStorage (severity)
6. **Description** → SessionStorage (description)
7. **Review & Submit** → POST to `/api/evidence/submit`
   - Combines all data into evidenceData object
   - Returns success/error response
   - Clears sessionStorage on success

## 📋 Evidence Data Schema

When submitted to `/api/evidence/submit`:

```typescript
{
  lat: number,
  lng: number,
  category: string,
  severity: "Low" | "Medium" | "High",
  title: string,
  note: string,
  reporter: string,
  date: string (YYYY-MM-DD),
  zone: "User Submitted",
  upvotes: 0,
  verified: false,
  status: "Open",
  images: string[] (base64),
}
```

## ✨ UX Enhancements

- **Progress Bars**: Visual 7-step progress on each page
- **Character Counts**: Real-time character limit feedback
- **Disabled States**: Continue buttons disabled until required fields filled
- **Error Handling**: Validation errors with red styling
- **Transitions**: Smooth active:scale-95 on buttons
- **Suggestions**: Example text for title and description

## 🛠️ File Structure

```
app/peep/user/report-flow/
├── page.tsx                           (Step 1: Location)
├── capture-photo/
│   └── page.tsx                      (Step 2: Photo)
├── add-title/
│   └── page.tsx                      (Step 3: Title)
├── select-category/
│   └── page.tsx                      (Step 4: Category)
├── set-severity/
│   └── page.tsx                      (Step 5: Severity)
├── describe-issue/
│   └── page.tsx                      (Step 6: Description)
├── confirm-submit/
│   └── page.tsx                      (Step 7: Review & Submit)
└── [Legacy files - marked for cleanup]
    ├── capture-photo.tsx
    ├── describe-issue.tsx
    ├── select-category.tsx
    ├── set-severity.tsx
    ├── confirm-submit.tsx
    └── upload-photo.tsx
```

## 📝 Next Steps

- [ ] Delete legacy .tsx files (maintain only page.tsx in folders)
- [ ] Add API error handling UI
- [ ] Implement image compression before submission
- [ ] Add analytics tracking for each step
- [ ] Test with actual device geolocation
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
