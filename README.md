# Embrace – An Emotionally Adaptive AI Mental Health Chatbot

**Embrace** is a multi-modal, customizable mental health support chatbot designed to help users manage emotional distress through empathetic and user-controlled AI conversations. Built for accessibility and emotional resonance, it allows users to switch between Text and Voice modes and adjust the chatbot's personality in real time. This application is also available on https://embrace-flame.vercel.app/. 

---

## 🌟 Features

- 🗣️ **Multi-Modal Communication**: Text-to-Text, Text-to-Voice, Voice-to-Text, or Voice-to-Voice interactions.
- 🎭 **Persona Customization**: Choose chatbot tone or predefined personas (Jenna or Marcus).
- 🔄 **Real-Time Adaptability**: Change interaction mode and personality on the fly.
- 📊 **Planned**: Emotional trend tracking and progress dashboard.

---

## 🧠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB
- **AI Integration**: Google Gemini API
- **Speech**: Web Speech API for TTS/STT
- **Authentication**: Auth.js (NextAuth)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance
- Google Gemini API Key

### Installation

```bash
git clone https://github.com/your-username/embrace-chatbot.git
cd embrace-chatbot
npm install
```

### Environment Variables

Create a `.env.local` file with the following:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Run the Development Server

```bash
npm run dev
```

Go to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```bash
app/
  ├── (auth)/           # Auth routes (login/signup)
  ├── (root)/           # Root pages and homepage
  ├── api/              # API routes (chatbot, auth)
  ├── fonts/            # Custom font setup
  ├── favicon.ico
  ├── globals.css       # Global Tailwind & base styles
  ├── layout.tsx        # Root layout
  └── page.tsx          # App entry point

components/             # Reusable UI components
context/                # React context (e.g. auth provider)
hooks/                  # Custom React hooks
public/                 # Static assets
styles/                 # Additional styles
types/                  # TypeScript types and interfaces
utils/                  # Utility functions (e.g. db.ts, prompt builders)
```

---

## ✨ Usage Guide

1. Sign up or log in
2. Select current mood
3. Select a conversation mode (e.g. Text/Text, Voice/Voice)
4. Pick a chatbot persona (Jenna or Marcus)
5. Choose whether to set customizable traits
6. Chat using natural language, via text or voice
7. Adapt chatbot tone during the conversation as needed

---

## 📌 Limitations

- English-only support (for now)
- Not a licensed therapy tool
- Crisis detection is rule-based (no ML classification yet)

---

## 🔮 Roadmap

- ✅ Persona customization
- ✅ Multi-modal interaction
- ⏳ Emotional trend tracking & analytics
- ⏳ Therapist dashboard integration
- ⏳ More expressive voice generation

---

## 🙌 Acknowledgements

- Google Gemini API
- Next.js + Auth.js team
- Feedback from test users & project supervisor

---

## 📄 License

This project was developed for academic purposes as part of a Final Year Project. All rights reserved unless explicitly stated.

