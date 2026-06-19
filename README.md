# FansFinder Clone

A full-stack clone of FansFinder.com built with React + Express + MongoDB.  
Features multi-language support (English, Hebrew, French) with automatic IP-based detection and a built-in admin panel for managing models.

## Features

### Public Site
- Profile listing with avatar, stats, bio, and pricing
- Filter tabs: Top, New, Free, Popular
- Search by name, username, keywords, or tags
- Multi-language support (EN, HE, FR) with automatic IP-based detection
- RTL support for Hebrew
- Manual language switcher in the header
- Responsive design
- Pagination with "Load More"

### Admin Panel
- Password-protected admin dashboard at `/admin`
- Add, edit, and delete model profiles
- Manage all profile details: name, username, avatar, age, location, ethnicity, body type, hair, eyes
- OnlyFans link and pricing management
- Social links: Instagram, Twitter/X, TikTok, Snapchat, YouTube, Telegram, Reddit, Website
- Multi-language bio editor (English, Hebrew with RTL, French)
- Category, tags, and status management (online/offline, free/paid, new, verified)

## Tech Stack

- **Frontend:** React (Vite), React Router, i18next, Axios, React Icons
- **Backend:** Express.js, Mongoose
- **Database:** MongoDB
- **Geolocation:** geoip-lite

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally on port 27017

### 1. Install Dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment

Copy the example and adjust as needed:

```bash
cp server/.env.example server/.env
```

Default values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fansfinder
ADMIN_PASSWORD=admin123
```

### 3. Seed the Database

```bash
cd server && node seed.js
```

### 4. Start the Server

```bash
cd server && node index.js
```

Server runs on http://localhost:5000

### 5. Start the Client

```bash
cd client && npm run dev
```

Client runs on http://localhost:5173

### 6. Access Admin Panel

Navigate to http://localhost:5173/admin and log in with your `ADMIN_PASSWORD`.

## Project Structure

```
findings_website/
├── client/                # React frontend (Vite)
│   └── src/
│       ├── admin/         # Admin panel (Login, Dashboard, ProfileForm)
│       ├── components/    # Header, ProfileCard, FilterTabs, Breadcrumb
│       ├── i18n/          # Translations (EN, HE, FR)
│       ├── pages/         # Public pages (Home)
│       ├── api.js         # API service layer
│       ├── App.jsx        # Router setup
│       └── App.css        # Global styles
├── server/                # Express backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes (profiles, geo, admin)
│   ├── seed.js            # Database seeder
│   └── index.js           # Server entry point
└── package.json           # Root scripts
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/fansfinder` | MongoDB connection string |
| `ADMIN_PASSWORD` | `admin123` | Admin panel password |
| `VITE_API_URL` | `http://localhost:5000/api` | API base URL (client-side) |
