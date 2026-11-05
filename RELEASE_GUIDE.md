# 🚀 Guide: How to Add a GitHub Release for All Three Applications

This guide shows you step-by-step how to publish releases on GitHub for **all three applications**:
1. 🌐 **Admin Operations Website** (`/#admin`)
2. 📱 **Student Commuter Mobile App** (`/#student`)
3. 🚎 **Driver In-Cab Console HUD** (`/#driver`)

---

## 📌 Method 1: All-in-One Unified Suite Release (Recommended)

Because all three applications share the same synchronized real-time GPS telemetry engine and backend data, releasing them together under a single version tag (e.g. `v1.0.0`) ensures full compatibility.

### Step 1: Push your code to GitHub
If you haven't pushed your repository to GitHub yet:
```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: complete CampusTrack suite (Admin website, Student app, Driver console)"

# 4. Set default branch to main
git branch -M main

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

### Step 2: Create a Production Build
Before releasing, package the web build:
```bash
# Install dependencies (if not already done)
npm install

# Build the production distribution
npm run build

# (Optional) Zip the dist folder to upload as a release asset
cd dist && zip -r ../campustrack-v1.0.0.zip . && cd ..
```

---

### Step 3: Create the Release on GitHub (Web Interface)

1. Go to your repository on **GitHub.com** (`https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>`).
2. On the right-hand sidebar, click on **Releases** (or click **Tags** -> **Releases**).
3. Click the green button: **"Draft a new release"** (or **"Create a new release"**).
4. Fill in the release details:
   - **Choose a tag**: Type `v1.0.0` and click *Create new tag: v1.0.0 on publish*.
   - **Target**: `main`.
   - **Release title**: `CampusTrack Suite v1.0.0 - Admin, Student & Driver Apps`
   - **Release description**: Paste the release notes template below.
   - **Attach binaries / assets**: Drag and drop `campustrack-v1.0.0.zip` (from your `dist/` build).
5. Click **"Publish release"**.

---

### 📝 Recommended Release Notes Template (Copy & Paste)

```markdown
# 🚎 Aditya University CampusTrack Suite v1.0.0

A unified real-time campus fleet tracking and commuter operations platform containing three standalone application experiences:

### 🌐 1. Admin Operations Website
- **Direct Route**: `/#admin`
- Interactive vector SVG campus fleet map with real-time bus positions & rotation.
- Schedule deviation tracking (`+6m Delay`, `On Time` status tags).
- Route & Stop management: Add waypoints, remove stops, edit route colors.
- Fleet allocation: Assign or unassign drivers and students to/from specific bus numbers.
- Student Pass Directory table with instant bus assignment dropdown and pass validity controls.
- Emergency SOS Siren & fleet broadcast notice dispatcher.

### 📱 2. Student Commuter Mobile App
- **Direct Route**: `/#student`
- Real-time bus GPS tracking with dynamic ETA countdown ("Arriving in 3 min").
- Live pickup stop timeline with proximity radar and seat occupancy meter.
- Digital holographic QR transport pass with photo, validity, and roll number.
- Driver direct call and driver rating card.
- Lost & Found item reporting dialog.
- Switchable between Smartphone device mockup and responsive full-screen mobile web.

### 🚎 3. Driver In-Cab Console HUD
- **Direct Route**: `/#driver`
- High-contrast cockpit tablet terminal for bus dashboard mounting.
- Digital speedometer HUD with 45 km/h campus speed limit warning.
- Large tactile "Mark Arrived at Stop" action button (updates student ETAs in real-time).
- Big touch passenger counter (`+` and `-` boarding).
- Optical camera QR pass scanner simulator for student boarding validation.
- One-tap SOS Emergency Beacon with dispatch siren.
- Traffic delay reporter (+5m, +10m, +15m with reason logging).

### 🔀 4. Triple Live-Sync Simulator
- **Direct Route**: `/#split`
- Watch Driver console actions immediately update the Student app and Admin fleet map concurrently.

---
### 📦 Attached Assets
- `campustrack-v1.0.0.zip`: Minified static production build ready to host on GitHub Pages, Cloud Run, Vercel, or Netlify.
```

---

## 📌 Method 2: Separate Releases per Application (Component Tags)

If your organization prefers distinct release tags for each of the three applications:

### 1. Release Admin Website:
- **Tag**: `admin-v1.0.0`
- **Title**: `Admin Operations Website v1.0.0`
- **Description**: Focused on fleet management, route planning, driver/student bus allocation, and schedule deviation monitoring.

### 2. Release Student App:
- **Tag**: `student-v1.0.0`
- **Title**: `Student Commuter Mobile App v1.0.0`
- **Description**: Focused on student mobile features: live bus tracking, ETA countdown, digital QR pass, and stop timeline.

### 3. Release Driver Console:
- **Tag**: `driver-v1.0.0`
- **Title**: `Driver In-Cab Console HUD v1.0.0`
- **Description**: Focused on the in-cab bus tablet HUD: next stop arrival, passenger count, QR scan validator, and SOS beacon.

---

## 📌 Method 3: Automated Releases with GitHub Actions

A ready-to-use GitHub Actions workflow is included at `.github/workflows/release.yml`.

Whenever you create and push a tag from your terminal:
```bash
# Create tag
git tag v1.0.0

# Push tag to GitHub
git push origin v1.0.0
```

GitHub Actions will automatically:
1. Run type checking and linter (`npm run lint`).
2. Build the production distribution (`npm run build`).
3. Bundle all three apps into `campustrack-transit-suite-release.zip`.
4. Automatically generate the release on GitHub with release notes and attach the ZIP artifact!
