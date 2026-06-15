# Cosmiq — AI-Powered Vedic Astrology App

A cross-platform mobile app (iOS, Android, Web) built with **Expo / React Native** and a **Node.js / Express** backend. Cosmiq delivers personalised Vedic astrology readings, daily cosmic reports, AI chat guidance, and remedies based on a user's natal chart.

---

## Table of Contents

1. [Project Scope](#project-scope)
2. [Repository Structure](#repository-structure)
3. [Tech Stack](#tech-stack)
4. [Environment Setup](#environment-setup)
5. [API Endpoints](#api-endpoints)
   - [Auth](#auth-endpoints)
   - [User](#user-endpoints)
   - [Horoscope / Home](#horoscope--home-endpoints)
   - [Reports](#reports-endpoints)
   - [Chat / AI](#chat--ai-endpoints)
   - [Astrologers](#astrologers-endpoints)
   - [Notifications](#notifications-endpoints)
   - [Starbase](#starbase-endpoints)
6. [Data Schemas](#data-schemas)

---

## Project Scope

| Area | Status | Description |
|------|--------|-------------|
| Auth (Login / Register) | UI complete, API wired | Email + password auth, multi-step registration with birth details |
| Home tab | UI complete, API wired | Daily horoscope, lucky stats, planetary overview, auspicious timeline |
| Reports tab | UI complete, API stub | Daily/Weekly/Monthly/Yearly reports with domain scores, planet transits, remedies, life timeline |
| Chat (Cosmiq AI) | UI complete, API wired | LLM-powered Vedic astrologer chat with conversation history |
| Astrologers tab | Placeholder | Browse & book human astrologers |
| Starbase tab | Placeholder | Vedic astrology knowledge base |
| Profile tab | Placeholder | User profile, edit details |
| Notifications | Placeholder | Push alerts for daily reports and auspicious windows |
| Backend server | Scaffold | All routes defined; implementation pending |

---

## Repository Structure

```
astrology-app/
├── astrology-app/              # Expo React Native frontend
│   ├── app/
│   │   ├── _layout.jsx         # Root stack navigator
│   │   ├── index.jsx           # Redirect → auth/login
│   │   ├── auth/
│   │   │   ├── login.jsx       # Login screen
│   │   │   └── register.jsx    # Multi-step registration
│   │   ├── (tabs)/
│   │   │   ├── _layout.jsx     # Bottom tab navigator
│   │   │   ├── index.jsx       # Home / Discover
│   │   │   ├── discover.jsx    # Astrologers (placeholder)
│   │   │   ├── starbase.jsx    # Starbase (placeholder)
│   │   │   ├── reports.jsx     # Reports tab
│   │   │   └── profile.jsx     # Profile (placeholder)
│   │   └── screens/
│   │       ├── ChatScreen.jsx  # Cosmiq AI chat
│   │       └── NotificationsScreen.jsx
│   ├── components/
│   │   ├── auth/               # ZodiacOrbit, CosmicDatePicker, CityPicker, LagnaPicker
│   │   ├── chat/               # ChatHeader, ChatBubble, VoiceMessageBubble, etc.
│   │   ├── home/               # HomeHeader, DailyHoroscopeCard, LuckyStatsRow, etc.
│   │   ├── reports/            # DailyScoreCard, DomainExpandCard, PlanetInfluenceStrip, etc.
│   │   ├── profile/            # BirthDetailsCard, EditProfileForm, ZodiacSummaryCard
│   │   ├── layout/             # BottomTabBar, ScreenWrapper
│   │   └── ui/                 # GlassCard, GlowButton, CosmicInput, LoadingSkeleton, etc.
│   ├── constants/
│   │   ├── Colors.js
│   │   ├── Layout.js
│   │   └── Typography.js
│   ├── hooks/
│   │   ├── useAstroData.js     # Fetches daily horoscope (falls back to mock if API unavailable)
│   │   └── useChat.js          # Chat state + API integration
│   ├── services/
│   │   └── api.js              # Centralised fetch wrapper + all API call functions
│   └── .env.example            # Frontend environment variable template
└── server/
    ├── server.js               # Express app — all routes scaffolded with JSDoc
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Expo 54 (React Native 0.81) |
| Navigation | expo-router v6 (file-based) + React Navigation |
| UI | Custom components — glassmorphism, glow effects, gradients |
| Animations | React Native Reanimated 4, Animated API |
| Backend | Node.js with Express (ES modules) |
| Auth | JWT (server-signed, stored in-memory on client) |
| AI chat | LLM proxied through backend (provider TBD — Claude / GPT-4) |

---

## Environment Setup

### Frontend (`astrology-app/`)

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp astrology-app/.env.example astrology-app/.env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | Yes | Backend URL (dev: `http://localhost:5000`) |
| `EXPO_PUBLIC_JWT_SECRET` | Optional | Only if the frontend verifies JWTs locally |
| `EXPO_PUBLIC_CHAT_API_KEY` | Yes | Key to authenticate frontend→backend chat requests |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID for social login |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Yes | EAS Build / OTA updates |
| `EXPO_PUBLIC_APP_ENV` | Optional | `development` / `staging` / `production` |

> All Expo environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the client bundle.

### Backend (`server/`)

Create `server/.env`:

```
PORT=5000
JWT_SECRET=your_secret_here
AI_API_KEY=your_llm_provider_key
DATABASE_URL=your_db_connection_string
```

---

## API Endpoints

All endpoints are prefixed with the `EXPO_PUBLIC_API_BASE_URL`.  
Protected endpoints require `Authorization: Bearer <token>` in the request header.

---

### Auth Endpoints

#### `POST /api/auth/register`

Creates a new user account. The backend derives the zodiac sign from `birthDate`.

**Request body:**
```json
{
  "email": "arya@example.com",
  "password": "securepass123",
  "name": "Arya Silva",
  "gender": "Female",
  "birthDate": "1995-08-15",
  "birthTime": "14:30",
  "birthCity": "Colombo, Sri Lanka",
  "lagna": "Scorpio"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_abc123",
    "email": "arya@example.com",
    "name": "Arya Silva",
    "sign": "Leo",
    "signSymbol": "♌",
    "signColor": "#FFB84A",
    "lagna": "Scorpio",
    "birthDate": "15 August 1995",
    "birthCity": "Colombo, Sri Lanka",
    "avatarUrl": null
  }
}
```

---

#### `POST /api/auth/login`

Authenticates a user and returns a JWT.

**Request body:**
```json
{
  "email": "arya@example.com",
  "password": "securepass123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_abc123",
    "email": "arya@example.com",
    "name": "Arya Silva",
    "sign": "Leo",
    "signSymbol": "♌",
    "signColor": "#FFB84A",
    "lagna": "Scorpio",
    "birthDate": "15 August 1995",
    "birthCity": "Colombo, Sri Lanka",
    "avatarUrl": null
  }
}
```

**Error `401`:**
```json
{ "message": "Invalid email or password" }
```

---

#### `POST /api/auth/logout`

Invalidates the JWT server-side (requires auth header).

**Response `200`:**
```json
{ "message": "Logged out" }
```

---

### User Endpoints

#### `GET /api/user/profile`

Returns the full profile of the authenticated user.

**Response `200`:**
```json
{
  "id": "usr_abc123",
  "email": "arya@example.com",
  "name": "Arya Silva",
  "sign": "Leo",
  "signSymbol": "♌",
  "signColor": "#FFB84A",
  "lagna": "Scorpio",
  "birthDate": "15 August 1995",
  "birthCity": "Colombo, Sri Lanka",
  "avatarUrl": "https://cdn.cosmiq.app/avatars/usr_abc123.jpg"
}
```

---

#### `PUT /api/user/profile`

Updates editable fields. `birthDate` and `lagna` cannot be changed after registration.

**Request body (all fields optional):**
```json
{
  "name": "Arya De Silva",
  "birthCity": "Kandy, Sri Lanka",
  "avatarUrl": "https://cdn.cosmiq.app/avatars/new.jpg"
}
```

**Response `200`:** Updated user object (same shape as `GET /api/user/profile`).

---

### Horoscope / Home Endpoints

#### `GET /api/horoscope/daily?userId=&date=YYYY-MM-DD`

Powers the Home tab: `DailyHoroscopeCard`, `LuckyStatsRow`, `PlanetaryOverview`.

**Response `200`:**
```json
{
  "date": "2026-06-15",
  "sign": "Leo",
  "summary": "The cosmos align in your favour today. Venus in your fifth house brings unexpected joy and creative energy. Trust your instincts — a meaningful connection awaits.",
  "luckyNumber": 7,
  "luckyColor": { "name": "Golden Amber", "hex": "#C8973A", "emoji": "🟡" },
  "luckyTime": "09:15 – 10:45 AM",
  "energy": 82,
  "mood": "Optimistic",
  "moonPhase": "Waxing Gibbous",
  "moonEmoji": "🌖",
  "planets": [
    { "name": "Sun",     "symbol": "☉", "position": "Gemini",   "house": "10th", "influence": "positive" },
    { "name": "Moon",    "symbol": "☾", "position": "Scorpio",  "house": "3rd",  "influence": "neutral"  },
    { "name": "Mercury", "symbol": "☿", "position": "Cancer",   "house": "11th", "influence": "positive" },
    { "name": "Venus",   "symbol": "♀", "position": "Leo",      "house": "12th", "influence": "positive" },
    { "name": "Mars",    "symbol": "♂", "position": "Aries",    "house": "8th",  "influence": "caution"  },
    { "name": "Jupiter", "symbol": "♃", "position": "Taurus",   "house": "9th",  "influence": "positive" },
    { "name": "Saturn",  "symbol": "♄", "position": "Aquarius", "house": "6th",  "influence": "neutral"  },
    { "name": "Rahu",    "symbol": "☊", "position": "Pisces",   "house": "7th",  "influence": "caution"  },
    { "name": "Ketu",    "symbol": "☋", "position": "Virgo",    "house": "1st",  "influence": "neutral"  }
  ]
}
```

---

#### `GET /api/horoscope/auspicious-times?userId=&date=YYYY-MM-DD`

Powers `AuspiciousTimeline` (Home tab) and `AuspiciousTimingsCard` (Reports tab).  
Times are calculated from the user's birth city timezone using Rahu Kalam rules.

**Response `200`:**
```json
[
  { "time": "06:00 – 07:30 AM", "type": "best",  "activity": "Meditation, puja and important decisions" },
  { "time": "09:15 – 10:45 AM", "type": "best",  "activity": "Business meetings and creative work" },
  { "time": "12:00 – 01:30 PM", "type": "good",  "activity": "Financial discussions" },
  { "time": "02:30 – 04:00 PM", "type": "avoid", "activity": "Avoid signing contracts (Rahu Kalam)" },
  { "time": "06:30 – 08:00 PM", "type": "good",  "activity": "Social interactions and romance" },
  { "time": "10:00 PM+",        "type": "avoid", "activity": "Avoid major decisions — energy is low" }
]
```

---

### Reports Endpoints

#### `GET /api/reports/daily?userId=&date=YYYY-MM-DD`

Powers the `DailyScoreCard` at the top of the Reports tab.

**Response `200`:**
```json
{
  "date": "2026-06-15",
  "cosmicScore": 78,
  "cosmicLabel": "Highly Favourable",
  "headline": "Jupiter amplifies your potential",
  "summary": "A powerful day for career decisions and creative expression. Your natural leadership shines."
}
```

---

#### `GET /api/reports/domains?userId=&date=YYYY-MM-DD&domain=love|career|health|wealth`

Omit `domain` to return all four. Powers `DomainExpandCard`.

**Response `200`:**
```json
[
  {
    "id": "love",
    "label": "Love & Relationships",
    "color": "#FF6B8A",
    "score": 84,
    "summary": "Venus shines beautifully in your 5th house",
    "detail": "Venus entering your 5th house brings warmth, attraction and emotional depth to all your relationships today. Single Leo natives may encounter someone with a meaningful connection.",
    "subScores": [
      { "label": "Romance",  "value": 88 },
      { "label": "Harmony",  "value": 80 },
      { "label": "Intimacy", "value": 83 }
    ],
    "tips": [
      "Express your feelings openly — vulnerability is your strength today.",
      "Plan an evening activity that involves creativity or art.",
      "Avoid confrontational discussions after 9 PM."
    ]
  },
  {
    "id": "career",
    "label": "Career & Success",
    "color": "#4AD4FF",
    "score": 72,
    "summary": "Mercury sharpens your analytical mind",
    "detail": "Mercury in your 10th house boosts communication skills and intellectual clarity.",
    "subScores": [
      { "label": "Focus",     "value": 78 },
      { "label": "Influence", "value": 70 },
      { "label": "Progress",  "value": 68 }
    ],
    "tips": [
      "Schedule important meetings between 10 AM – 1 PM.",
      "Your creative ideas will be well-received — speak up in team discussions.",
      "Double-check contracts or documents before signing."
    ]
  },
  {
    "id": "health",
    "label": "Health & Vitality",
    "color": "#4AFF8C",
    "score": 75,
    "summary": "Moderate energy levels, prioritise rest",
    "detail": "Mars in your 8th house indicates high physical drive but also a risk of overexertion.",
    "subScores": [
      { "label": "Physical", "value": 70 },
      { "label": "Mental",   "value": 82 },
      { "label": "Immunity", "value": 73 }
    ],
    "tips": [
      "Start the day with warm water infused with ginger and honey.",
      "Take short breaks during work to avoid eye or back strain.",
      "Aim for at least 7 hours of sleep tonight."
    ]
  },
  {
    "id": "wealth",
    "label": "Wealth & Finance",
    "color": "#C8973A",
    "score": 65,
    "summary": "Saturn urges caution in spending",
    "detail": "Saturn's influence on your 2nd house counsels financial discipline today.",
    "subScores": [
      { "label": "Income",     "value": 70 },
      { "label": "Savings",    "value": 68 },
      { "label": "Investment", "value": 57 }
    ],
    "tips": [
      "Track all expenditures today — small leaks cause large deficits.",
      "Revisit your savings goals and adjust where needed.",
      "Avoid gambling, speculation or impulsive purchases."
    ]
  }
]
```

---

#### `GET /api/reports/planet-transits?userId=&date=YYYY-MM-DD`

Powers `PlanetInfluenceStrip`. Returns all 9 Vedic planets.

**Response `200`:** Same `planets` array shape as `/api/horoscope/daily`.

---

#### `GET /api/reports/auspicious-timings?userId=&date=YYYY-MM-DD`

Powers `AuspiciousTimingsCard` in Reports tab. Same response shape as `/api/horoscope/auspicious-times`.

---

#### `GET /api/reports/remedies?userId=&date=YYYY-MM-DD`

Powers `RemediesCard`. Derived from current transits vs. the user's natal chart.

**Response `200`:**
```json
[
  {
    "type": "Gemstone",
    "value": "Ruby",
    "desc": "Wear on ring finger",
    "color": "#FF6B8A"
  },
  {
    "type": "Lucky Color",
    "value": "Golden Yellow",
    "desc": "Wear or carry this color",
    "color": "#FFB84A"
  },
  {
    "type": "Fasting",
    "value": "Sunday",
    "desc": "Sun deity fasting ritual",
    "color": "#4AFF8C"
  },
  {
    "type": "Mantra",
    "value": "Om Suryaya Namah",
    "desc": "Sun mantra for strength",
    "color": "#C8973A",
    "fullMantra": "ॐ सूर्याय नमः"
  }
]
```

---

#### `GET /api/reports/yearly?userId=&year=YYYY`

Powers `LifeTimelineCard`. Based on major Dasha / transit cycles from the user's birth details.

**Response `200`:**
```json
[
  { "year": "2024–25", "label": "Jupiter transit activates career breakthroughs. Expect recognition and new leadership opportunities." },
  { "year": "2025–26", "label": "Saturn matures your long-term goals. A period of disciplined growth and spiritual advancement." },
  { "year": "2026–27", "label": "Rahu brings transformative change in residence or career location. International opportunities may arise." },
  { "year": "2028+",   "label": "Jupiter in Scorpio marks a golden period for marriage prospects and deep personal evolution." }
]
```

---

#### `GET /api/reports/weekly?userId=&weekStartDate=YYYY-MM-DD`

Premium feature. Powers the Weekly tab in `ReportTypeSelector`.

**Response `200`:**
```json
{
  "weekRange": "16 – 22 June 2026",
  "cosmicScore": 74,
  "summary": "A week of measured progress and social opportunities.",
  "days": [
    { "date": "2026-06-16", "score": 80, "highlight": "Strong day for negotiations" },
    { "date": "2026-06-17", "score": 65, "highlight": "Rest and reflect" }
  ]
}
```

---

#### `GET /api/reports/monthly?userId=&month=YYYY-MM`

Premium feature. Powers the Monthly tab.

**Response `200`:**
```json
{
  "month": "June 2026",
  "cosmicScore": 71,
  "summary": "Jupiter's transit brings expansion and opportunity throughout the month.",
  "weeks": [
    { "weekRange": "1 – 7 Jun",  "score": 68, "highlight": "Focus on inner work" },
    { "weekRange": "8 – 14 Jun", "score": 75, "highlight": "Career gains likely" }
  ]
}
```

---

#### `POST /api/reports/share`

Generates a shareable link used by the Share button in `ReportsHeader`.

**Request body:**
```json
{
  "userId": "usr_abc123",
  "date": "2026-06-15",
  "reportType": "daily"
}
```

**Response `200`:**
```json
{
  "shareUrl": "https://cosmiq.app/share/rep_xyz789",
  "shareText": "✦ My Cosmiq Daily Report — 15 June 2026\nCosmic Score: 78/100 — Highly Favourable\n\nhttps://cosmiq.app/share/rep_xyz789"
}
```

---

### Chat / AI Endpoints

#### `POST /api/chat/message`

Proxies the user's message to the LLM with the user's natal chart injected as system context. The backend holds the AI provider key — never expose it to the client.

**Request body:**
```json
{
  "userId": "usr_abc123",
  "message": "What does Venus in my 7th house mean for relationships?",
  "conversationId": "conv_def456"
}
```

**Response `200`:**
```json
{
  "reply": "Based on your natal chart, Venus in your 7th house creates a powerful potential for a meaningful relationship this season. The upcoming Jupiter transit in June amplifies romantic energies beautifully. ✨",
  "conversationId": "conv_def456",
  "isVoice": false
}
```

---

#### `GET /api/chat/history?userId=&conversationId=&limit=20&offset=0`

Fetches paginated chat history to restore on re-open.

**Response `200`:**
```json
{
  "messages": [
    {
      "id": "msg_001",
      "role": "ai",
      "text": "Namaste ✨ I'm Cosmiq AI — your personal Vedic astrologer.",
      "timestamp": "2026-06-15T06:32:00Z",
      "isVoice": false
    },
    {
      "id": "msg_002",
      "role": "user",
      "text": "What does Venus in my 7th house mean?",
      "timestamp": "2026-06-15T06:33:10Z",
      "isVoice": false
    }
  ]
}
```

---

### Astrologers Endpoints

#### `GET /api/astrologers?page=1&limit=20&specialty=vedic|tarot|numerology`

Powers the Astrologers tab (currently a placeholder).

**Response `200`:**
```json
[
  {
    "id": "ast_001",
    "name": "Dr. Meera Iyer",
    "avatarUrl": "https://cdn.cosmiq.app/astrologers/meera.jpg",
    "specialty": "vedic",
    "rating": 4.9,
    "reviewCount": 1240,
    "pricePerMin": 3.50,
    "isOnline": true
  }
]
```

---

#### `GET /api/astrologers/:id`

Full astrologer profile for a detail/booking screen.

**Response `200`:**
```json
{
  "id": "ast_001",
  "name": "Dr. Meera Iyer",
  "avatarUrl": "https://cdn.cosmiq.app/astrologers/meera.jpg",
  "specialty": "vedic",
  "bio": "25 years of Vedic astrology practice. Specialises in Jyotish, Vastu, and Nadi readings.",
  "rating": 4.9,
  "reviewCount": 1240,
  "pricePerMin": 3.50,
  "isOnline": true,
  "languages": ["English", "Hindi", "Tamil"],
  "availability": [
    { "day": "Monday", "slots": ["09:00", "11:00", "14:00"] }
  ],
  "reviews": [
    { "user": "Priya M.", "rating": 5, "text": "Incredibly accurate predictions.", "date": "2026-05-20" }
  ]
}
```

---

### Notifications Endpoints

#### `GET /api/notifications?userId=&limit=20&offset=0`

Powers `NotificationsScreen`.

**Response `200`:**
```json
[
  {
    "id": "notif_001",
    "title": "Your Daily Report is Ready ✦",
    "body": "Cosmic Score 78 — Highly Favourable. Tap to read your full report.",
    "type": "daily_report",
    "isRead": false,
    "createdAt": "2026-06-15T06:00:00Z"
  },
  {
    "id": "notif_002",
    "title": "Auspicious Window Opens at 9:15 AM",
    "body": "Best time for business meetings and creative work.",
    "type": "auspicious_alert",
    "isRead": true,
    "createdAt": "2026-06-15T09:00:00Z"
  }
]
```

Notification types: `daily_report` | `auspicious_alert` | `chat_reply`

---

#### `PUT /api/notifications/:id/read`

**Response `200`:**
```json
{ "success": true }
```

---

### Starbase Endpoints

#### `GET /api/starbase/articles?category=planets|signs|houses|remedies&page=1`

Powers the Starbase tab knowledge base.

**Response `200`:**
```json
[
  {
    "id": "art_001",
    "title": "The 9 Planets in Vedic Astrology",
    "excerpt": "Known as the Navagrahas, the nine planets in Vedic astrology each govern different aspects of life...",
    "category": "planets",
    "imageUrl": "https://cdn.cosmiq.app/articles/navagrahas.jpg",
    "isPremium": false
  }
]
```

---

#### `GET /api/starbase/articles/:id`

**Response `200`:**
```json
{
  "id": "art_001",
  "title": "The 9 Planets in Vedic Astrology",
  "body": "Known as the Navagrahas, the nine planets in Vedic astrology...\n\n## Sun (Surya)\n...",
  "category": "planets",
  "imageUrl": "https://cdn.cosmiq.app/articles/navagrahas.jpg",
  "isPremium": false
}
```

---

## Data Schemas

### UserProfile
```ts
{
  id: string
  email: string
  name: string
  sign: string          // "Leo" | "Aries" | ...
  signSymbol: string    // "♌"
  signColor: string     // "#FFB84A"
  lagna: string         // "Scorpio"
  birthDate: string     // "15 August 1995"
  birthCity: string     // "Colombo, Sri Lanka"
  avatarUrl: string | null
}
```

### Planet
```ts
{
  name: "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Rahu" | "Ketu"
  symbol: string
  position: string      // zodiac sign, e.g. "Gemini"
  house: string         // "1st" – "12th"
  influence: "positive" | "neutral" | "caution"
}
```

### AuspiciousSlot
```ts
{
  time: string          // "06:00 – 07:30 AM"
  type: "best" | "good" | "avoid"
  activity: string
}
```

### DomainReport
```ts
{
  id: "love" | "career" | "health" | "wealth"
  label: string
  color: string         // hex
  score: number         // 0–100
  summary: string
  detail: string
  subScores: Array<{ label: string, value: number }>
  tips: string[]
}
```

### Remedy
```ts
{
  type: "Gemstone" | "Lucky Color" | "Fasting" | "Mantra"
  value: string
  desc: string
  color: string         // hex accent
  fullMantra?: string   // Devanagari / Sanskrit, Mantra type only
}
```

### ChatMessage
```ts
{
  id: string
  role: "user" | "ai"
  text: string
  timestamp: string     // ISO 8601
  isVoice: boolean
  duration?: number     // seconds, voice messages only
}
```

### Notification
```ts
{
  id: string
  title: string
  body: string
  type: "daily_report" | "auspicious_alert" | "chat_reply"
  isRead: boolean
  createdAt: string     // ISO 8601
}
```
