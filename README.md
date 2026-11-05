# 🚎 CampusTrack - Aditya University Fleet & Commuter Operations System

[![Release](https://img.shields.io/badge/Release-v1.0.0-purple.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Deployment-Live%20Online-emerald.svg)](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)

A production-grade college transit management platform featuring **three separate applications** synchronized in real-time through a differential GPS simulation engine:
1. 🌐 **Admin Operations Website** — Desktop dispatch & fleet operations portal.
2. 📱 **Student Commuter Mobile App** — Smartphone transit companion with live tracking & QR pass.
3. 🚎 **Driver In-Cab Console HUD** — Rugged tablet cockpit terminal for bus operators.

---

## ⚡ Instant Live Access (No Installation Needed!)

You can run and test all three applications right now in your web browser or on your phone:

| Application | Direct URL | Intended Device |
|---|---|---|
| **🌐 Admin Operations Website** | [Open Admin Website](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#admin) | Desktop / Laptop Screen |
| **📱 Student Commuter App** | [Open Student App](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#student) | Smartphone (iPhone / Android) |
| **🚎 Driver In-Cab Console** | [Open Driver Console](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#driver) | Tablet / Bus Cockpit Mount |
| **🔀 Triple Live-Sync Simulator** | [Open Live Sync](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#split) | Multi-Device Side-by-Side |
| **🏠 Transit Suite Hub** | [Open Suite Directory](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#portal) | Universal Launcher |

---

## 💻 How to Install & Run Locally on Your Device

### Option A: Run from Source Code (Developers)

#### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js) or [Bun](https://bun.sh/)

#### 1. Clone the repository
```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd <YOUR-REPO-NAME>
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start the application
```bash
npm run dev
```

Open your browser to:
👉 **`http://localhost:3000`**

- To open Admin Website: `http://localhost:3000/#admin`
- To open Student App: `http://localhost:3000/#student`
- To open Driver Console: `http://localhost:3000/#driver`
- To open Live Sync View: `http://localhost:3000/#split`

---

### Option B: Download the Pre-Packaged Release (No Development Tools Needed)

If you just want to run the pre-built application on any computer:

1. Go to the **[Releases](https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>/releases)** page on this repository.
2. Download **`campustrack-suite-release-v1.0.0.zip`**.
3. Extract the ZIP archive onto your computer.
4. Run a quick static server (e.g. using `npx serve` or Python):
   ```bash
   # Using npx (built into Node)
   npx serve .

   # OR using Python
   python3 -m http.server 3000
   ```
5. Open `http://localhost:3000` in your browser.

---

### Option C: Install as a Mobile App (PWA on iOS / Android)

The Student App and Driver Console can be installed directly onto your phone or tablet home screen like a native app:

- **On iPhone / iPad (Safari)**:
  1. Open [https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#student](https://ais-pre-s5avpho35d4aaanqexwiwa-434377332391.asia-southeast1.run.app/#student)
  2. Tap the **Share** button (box with upward arrow) at the bottom.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **Add**. The CampusTrack app icon will appear on your home screen!

- **On Android (Chrome)**:
  1. Open the URL in Google Chrome.
  2. Tap the three dots menu (⋮) in the top-right corner.
  3. Tap **"Install App"** or **"Add to Home Screen"**.

---

## 🌟 The Three Applications in Detail

### 1. 🌐 Admin Operations Website (`/#admin`)
Designed as a full-featured desktop operations center for campus dispatchers and transport directors:
- **Interactive Vector Fleet Map**: Real-time vector map tracking all vehicles with accurate headings and speed badges.
- **Schedule Deviation Intelligence**: Automatic schedule variance calculation showing on-time performance and delays (`+6m Delay`, `On Time`).
- **Route & Stop Management**: Add waypoints, remove stops, and edit route corridors.
- **Driver & Student Allocation**: Assign and unassign drivers to bus numbers, or allocate students to bus rosters with live seat capacity tracking.
- **Student Bus Pass Directory**: Searchable directory of student passes with instant bus number assignment dropdowns and QR validation status.
- **Dispatch Broadcast & Emergency SOS**: Fleet-wide emergency alerts and broadcast system.
- **Punctuality Analytics**: Route efficiency, punctuality compliance, and congestion logs.

### 2. 📱 Student Commuter Mobile App (`/#student`)
Dedicated mobile experience for college students commuting to Aditya University:
- **Live GPS Bus ETA**: Dynamic countdown timer showing minutes until bus arrival at the student's assigned pickup stop.
- **Stop Progress Timeline**: Proximity radar showing past, current, and upcoming stops with seat crowding occupancy meter.
- **Digital Holographic QR Pass**: Interactive digital bus pass with student photo, validity date, roll number, and security watermark.
- **Direct Driver Contact**: One-tap phone call button to reach the bus driver directly.
- **Smartphone Frame / Fullscreen Toggle**: View inside a realistic iPhone frame with status bar (`9:41 AM`, `5G`, `Wi-Fi`, `battery`) or responsive mobile web.
- **Lost & Found Dialog**: Report forgotten items directly to the driver and dispatch room.

### 3. 🚎 Driver In-Cab Console HUD (`/#driver`)
Heavy-duty in-cab dashboard tablet HUD for transit bus operators:
- **Cockpit Speedometer**: Large high-contrast speed display with a 45 km/h campus speed limit warning.
- **Tactile Stop Check-In**: Big "Mark Arrived at Stop" action button that updates student ETAs across the university.
- **Passenger Boarding Counter**: Big touch-friendly `+` and `-` counter for passenger logging.
- **Optical Camera QR Scanner**: Simulated camera barcode scanner for validating student boarding passes.
- **One-Tap Emergency SOS**: Red beacon button alerting campus security and dispatch immediately.
- **Traffic Delay Reporter**: Quick report buttons for traffic jams or mechanical delays.

---

## 🎨 Design System & Theme

The entire suite adheres to the Aditya University institutional brand identity:
- **Warm Cream**: `#FAF7F2` / `#F5EFEB`
- **Deep Purple**: `#2E1065` / `#3B0764` / `#581C87`
- **Soft Lavender**: `#EDE9FE` / `#DDD6FE` / `#C084FC`
- **Dark Mode**: Full support with custom dark variants for night shift drivers and OLED screens.

---

## 🛠️ Build & Scripts

```bash
# Start development server on port 3000
npm run dev

# Run TypeScript type-checking & lint
npm run lint

# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview

# Package ready-to-publish release ZIP
npm run package:release
```

---

## 📄 License & Attribution

Built for **Aditya University Transportation Authority**.
All rights reserved © 2026.
