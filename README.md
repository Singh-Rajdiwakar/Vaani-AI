# VaaniAI — AI Voice Interview Practice Platform

<div align="center">
  <img src="public/robot.svg" alt="VaaniAI Logo" width="64" height="64" />
  <h3>Real-Time AI Voice Mock Interviews for Developers & Tech Professionals</h3>
  <p>Practice realistic, conversational voice interviews, get instant granular scoring, and land your dream tech role.</p>
</div>

---

## 🚀 Overview

**VaaniAI** is a modern, full-stack AI interview preparation platform designed to simulate realistic technical and behavioral voice interviews end-to-end. Powered by conversational AI voice agents and LLMs, VaaniAI listens to your spoken answers in real-time, asks contextual follow-ups, and delivers instant, actionable feedback across core evaluation categories.

### ✨ Key Features

- 🎙️ **Conversational AI Voice Interviews**: Speak naturally with an AI interviewer via conversational voice streaming (powered by Vapi AI).
- 🎯 **Targeted Question Generation**: Generates customized technical, behavioral, and role-specific questions tailored to role, seniority, and tech stack.
- ⚡ **Real-Time Speech Transcription**: Fast and accurate live speech-to-text with conversational turn-taking.
- 📊 **Granular Scoring & Actionable Feedback**: Instant evaluation across 5 categories:
  - Communication Skills
  - Technical Knowledge
  - Problem Solving
  - Cultural Fit
  - Confidence & Clarity
- 📈 **Performance Dashboard**: Track past interview sessions, review transcripts, and monitor skill progression.
- 🎨 **Dark Premium UI**: Polished, responsive design with smooth animations powered by Tailwind CSS v4 and Framer Motion.
- 🔒 **Secure Authentication & Session Management**: Email/password authentication with Firebase Auth and secure server-side session cookies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Voice Agent**: [Vapi AI](https://vapi.ai/) Web SDK
- **AI Intelligence**: [Google Gemini](https://ai.google.dev/) via `@ai-sdk/google`
- **Database & Auth**: [Firebase](https://firebase.google.com/) Client SDK & Firebase Admin SDK (Cloud Firestore)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Devicon](https://devicon.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/             # Authentication route group (sign-in, sign-up)
│   ├── (root)/             # Authenticated route group
│   │   ├── dashboard/      # User dashboard & past interview list
│   │   └── interview/      # Interview creation & live voice room
│   ├── api/                # Next.js API routes (vapi webhook, generate, auth)
│   ├── layout.tsx          # Root layout with fonts and toast provider
│   └── page.tsx            # Public landing page & auth redirect
├── components/
│   ├── ui/                 # Accessible primitives (button, input, badge)
│   ├── Agent.tsx           # Vapi voice agent controller & microphone interface
│   ├── AuthForm.tsx        # Split-screen auth form with animations
│   ├── DisplayTechIcons.tsx# Technology badge icons renderer
│   ├── InterviewCard.tsx   # Past interview summary card
│   ├── InterviewForm.tsx   # Interview configuration form
│   ├── LandingPage.tsx     # Hero, features, demo preview & CTA landing page
│   └── Navbar.tsx          # Sticky navigation with profile dropdown
├── constants/              # Interview assistant prompts, schemas & cover images
├── firebase/               # Firebase Client & Admin SDK initialization
├── lib/                    # Server & client utilities
└── types/                  # TypeScript interface definitions
```

---

## 🏁 Getting Started

### 1. Prerequisites

- **Node.js**: `v20.x` or higher recommended
- **npm** or **yarn** / **pnpm**
- Firebase Project with Firestore & Auth enabled
- Vapi AI Account (API Key + Public Key)
- Google Gemini API Key

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Vaani AI
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Vapi AI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_PRIVATE_API_KEY=your_vapi_private_key

# Google AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Build

```bash
npm run build
npm start
```

---

## 👤 Author

Built by **Singh Rajdiwakar**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
