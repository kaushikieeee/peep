# 🌍 PEEP - Public Evidence for Environmental Protection

**Live Deployment Status:** Ready for Vercel 🚀

## Quick Start

### Local Development
```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

### Main Routes
- **User App:** `http://localhost:3000/peep/user`
- **Admin Dashboard:** `http://localhost:3000/admin/login`
  - Email: `admin@peep.com`
  - Password: `admin123`

---

## ✨ Features

### 🗺️ User Features
- Interactive Maplibre GL map with 21 pollution markers
- Real-time pollution report submission
- Multi-step reporting workflow (category → photo → description → severity)
- Photo upload with camera/gallery options
- User profile with submitted reports
- Auto-centered map to user location with fallback to Bangalore area

### 👨‍💼 Admin Features
- **Evidence Management**
  - View all 21 submitted reports in table format
  - Filter by: Category, Severity, Zone, Status
  - Click reports to view full details + high-quality images
  - Take actions:
    - ✅ Verify reports
    - 📌 Mark for follow-up
    - 🔄 Forward to authorities
    - 🏭 Assign to service providers

- **Dashboard** - Statistics and recent reports
- **Zone Editor** - Manage pollution zones
- **Authority Forwarding** - Route reports to responsible authorities
- **Service Marketplace** - Connect with cleanup providers
- **Settings** - Configure system parameters

---

## 📊 Mock Data

### 21 Pollution Reports
Located in `/public/data/mock-reports.json` - Centered around Bangalore area (11.0420, 77.0269)

**Categories:**
- Air Pollution (6 reports)
- Water Pollution (6 reports)
- Soil Contamination (4 reports)
- Noise Pollution (2 reports)
- Plastic Waste (2 reports)

### 19 Real Pollution Images
All images in `/public/images/` with specific mappings to each report category

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.0.3 (Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4.1.9

**Mapping:**
- Maplibre GL 5.13.0
- OpenStreetMap tiles

**UI Components:**
- 50+ Shadcn/UI components
- Lucide React icons
- Radix UI primitives

**Forms & Validation:**
- React Hook Form
- Zod

**Data Visualization:**
- Recharts

---

## 📁 Project Structure

```
app/
├── api/data/reports/        # API endpoint
├── admin/                   # Admin system (7 pages)
└── peep/
    ├── user/               # User app
    └── admin/              # Redirect to /admin

components/
├── peep/                    # User components (map, cards)
├── admin/                   # Admin components (sidebar, map)
└── ui/                      # 50+ UI components

public/
├── images/                  # 19 JPEG pollution images
└── data/                    # Mock data (reports.json)
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub: `https://github.com/kaushikieeee/peep`
2. Go to https://vercel.com/dashboard
3. Click "Add New Project"
4. Select repository and import
5. Click "Deploy"

**No environment variables needed** - All data is local/mock.

See [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md) for detailed verification.

---

## 📱 Demo Credentials

**Admin Login:**
- Email: `admin@peep.com`
- Password: `admin123`

**Demo User:** Pragadeesh

---

## 🎯 Key Endpoints

### API
- `GET /api/data/reports` - Fetch all pollution reports

### Pages
- `/` - Root (redirects to /peep/user)
- `/peep/user` - User map
- `/peep/user/profile` - User profile
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/evidence` - Evidence management
- `/admin/zones` - Zone editor
- `/admin/forwarding` - Authority forwarding
- `/admin/marketplace` - Service marketplace
- `/admin/settings` - Admin settings

---

## ✅ Quality Checklist

- ✅ All 21 reports have real images
- ✅ Evidence management displays images correctly
- ✅ Admin buttons trigger actions with feedback
- ✅ Filtering works on evidence page
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ TypeScript compilation successful
- ✅ No critical errors or warnings
- ✅ Mock data properly integrated
- ✅ All routes accessible
- ✅ Ready for production deployment

---

## 📝 License

MIT

---

**Status:** 🟢 Production Ready
**Last Updated:** November 15, 2025
