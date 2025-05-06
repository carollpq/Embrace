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
git clone https://github.com/carollpq/Embrace.git
cd embrace
npm install
```

### Environment Variables

Create a `.env.local` file with the following:

```env
AUTH_SECRET="sH6EoOjGVNWJZWRkUm/AP29Fxk1MaiC7NuMXJyNZZKg="
CLIENT_ID="1015776937666-5joran5u3a9cjo4p7738s3m26usmdk4o.apps.googleusercontent.com"
CLIENT_SECRET="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"
GOOGLE_CLIENT_ID={CLIENT_ID}
GOOGLE_CLIENT_SECRET={CLIENT_SECRET}
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI="mongodb+srv://carollpq:bMc8pGxsG6DIxWBK@embrace.ewwhl.mongodb.net/"
GEMINI_API_KEY="AIzaSyDgwaX4OsZ7IAIAg81qYXXWTRAlxjhtnzo"
JWT_SECRET="e075733c6a06e03515e2cfb8ca2a11f9871c5fd56c412ab2f9b10ba5fd72e029"
AWS_ACCESS_KEY_ID="AKIATJHQD2HBDTZTB2EN"
AWS_SECRET_ACCESS_KEY="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"
AWS_REGION=us-east-1
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

