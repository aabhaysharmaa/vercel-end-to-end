# 🚀 Vercel Clone — Deployment Platform

A production-grade deployment platform built from scratch. Push code to GitHub or GitLab and get it deployed automatically with real-time build logs, preview URLs, and CDN-powered serving.

---

## ✨ Features

- 🔗 GitHub & GitLab webhook integration
- ⚙️ Job Queue with Build Orchestrator
- 👷 Auto-scaled Build Workers
- 🌐 CDN Edge + Reverse Proxy
- 🔗 Unique preview URL per deployment
- 📡 Real-time build log streaming via WebSocket
- 🗄️ S3 for artifacts, PostgreSQL for state, Redis for caching
- 🛡️ API Gateway, Rate Limiter, Auth Service

---

## 🛠️ Tech Stack

| | |
|---|---|
| Frontend | Next.js 15, TailwindCSS, ShadcnUI |
| Backend | Node.js, Hono.js |
| Database | PostgreSQL, Prisma |
| Cache & Queue | Redis, BullMQ |
| Storage | AWS S3 | iDrive 
| Real-time | WebSocket |
| Auth | Clerk | 

---

## 🏗️ Architecture

```
GitHub / GitLab Webhook
        ↓
API Gateway → Rate Limiter → Auth
        ↓
Job Queue → Build Orchestrator
        ↓
Worker 1 | Worker 2 | Worker 3
        ↓                  ↓
Log Aggregator          S3 Artifacts
        ↓               PostgreSQL
WebSocket Server          Redis
        ↓
CDN Edge → Reverse Proxy → Preview URL
        ↓
      Users
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- AWS S3 bucket

### Installation

```bash
git clone https://github.com/abhaysharma/vercel-clone
cd vercel-clone
npm install
```

### Environment Variables

```env
DATABASE_URL=your_postgresql_url
REDIS_URL=your_redis_url
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### Run Locally

```bash
# Start the app
npm run dev

# Run the worker
npm run worker
```

---

## 📁 Project Structure

```
├── apps/
│   ├── web/          # Next.js frontend + dashboard
│   ├── api/          # Hono.js backend + API routes
│   └── worker/       # Build worker process
├── packages/
│   ├── db/           # Prisma schema + migrations
│   └── queue/        # BullMQ job definitions
```

---

## 🤝 Connect

Built by **Abhay Sharma**
- LinkedIn: [linkedin.com/in/abhaysharma](https://linkedin.com/in/abhaysharma)
- Email: abhaysharma9667200@gmail.com
