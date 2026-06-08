# Smart Project System - Frontend Web Client

This is the standalone frontend web client for the Smart Project System. It is built using Next.js (App Router), TypeScript, Redux Toolkit (RTK Query), and Vanilla CSS.

---

## Features Overview

* **Kanban Task Board**: Intuitive status columns (To Do, In Progress, Completed) with visual task cards.
* **Detailed Task Dialog**: 
  - Manage assignees, due dates, description details, and priorities.
  - Interactive discussion feed (comments) and file attachments.
* **Smart Permissions System**: UI dynamically hides/shows creation, editing, status updates, and comment/upload fields depending on your role (Admin, Manager, Member, or Assignee).
* **Filters & Infinite Scroll**: Fast client-side filtering (priority, status, assigned member, due date ranges) and search with dynamic scroll-to-load page loading.
* **Aesthetic Dark Mode**: Curated, harmonious color system (glassmorphic layouts, harmonized HSL-based dark mode tokens) with fluid micro-animations.
* **Dashboard Hub**: Visual summaries of active workloads, overdue assignments, and task counts.

---

## Environment Variables

Create a `.env.local` file in the root of the `frontend/` directory to configure connection parameters:

| Variable | Description | Default / Dev Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The URL pointing to your backend API gateway endpoint | `http://localhost:5050/api` |

### `.env.local` Quick Copy-Paste Template
```env
NEXT_PUBLIC_API_URL="http://localhost:5050/api"
```

---

## Project Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Environment
Create `.env.local` and add the backend connection variable:
```env
NEXT_PUBLIC_API_URL="http://localhost:5050/api"
```

### 3. Run in Development Mode
Start the Next.js development server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
Create an optimized production bundle:
```bash
npm run build
npm start
```

---

## Demo Credentials

You can use the following pre-seeded users for testing and grading (all users share the password `Password123`):

| Email | Name | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin@example.com` | Admin User | `ADMIN` | Full global access (comments/attaches to all tasks, creates projects/members) |
| `pm@example.com` | PM User | `PROJECT_MANAGER` | Can create projects, add members, and manage their tasks |
| `member1@example.com` | John Doe | `TEAM_MEMBER` | Can comment/attach on assigned tasks and projects they are member of |
| `member2@example.com` | Jane Smith | `TEAM_MEMBER` | Can comment/attach on assigned tasks and projects they are member of |
| `member3@example.com` | Bob Johnson | `TEAM_MEMBER` | Can comment/attach on assigned tasks and projects they are member of |

---

## Deployment Instructions

### Prerequisites
* A hosting platform specialized in static/serverless frontend hosting (e.g. Vercel, Netlify, Cloudflare Pages).
* Your backend API must already be deployed and accessible.

### Step-by-Step Deployment (e.g., Vercel):
1. **Import the Project**: Link your GitHub repository.
2. **Configure Root Directory**: In the project settings, set the **Root Directory** to `frontend`.
3. **Configure Environment Variables**:
   Add `NEXT_PUBLIC_API_URL` as a production environment variable and set it to your deployed backend API URL (e.g., `https://my-backend-app.railway.app/api`).
4. **Deploy**: Vercel will auto-detect the Next.js setup, install dependencies, run `npm run build`, and deploy the application.
