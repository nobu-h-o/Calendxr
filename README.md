# 📅 Calendxr

**Simplify your Calendar, with the power of AI**

[![GitHub stars](https://img.shields.io/github/stars/nobu-h-o/Calendxr?style=social)](https://github.com/nobu-h-o/Calendxr/stargazers)
[![GitHub license](https://img.shields.io/github/license/nobu-h-o/Calendxr)](https://github.com/nobu-h-o/Calendxr/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

English | [日本語](README.jp.md)

## 📋 Table of Contents
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [⚡ Features](#-features)
- [🔒 Privacy First Approach](#-privacy-first-approach)
- [🛠 Built With](#-built-with)
  - [Tech Stack](#tech-stack)
  - [APIs Used](#apis-used)
- [🧠 Architecture](#-architecture)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [👨‍💻 Dev Team](#-dev-team)
- [🙏 Acknowledgments](#-acknowledgments)

## 🚀 Getting Started

These instructions will help you set up the project on your local machine for development and testing. See the deployment section for notes on how to deploy the project in a live environment.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- [Git](https://git-scm.com/)

You will also need:
- A Google Cloud account with Calendar API and Vision API enabled
- OpenAI API key for certain AI functionalities

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nobu-h-o/Calendxr.git
   cd Calendxr
   ```

2. Set up environment variables:
   
   Copy the example environment file and update it with your values:
   ```bash
   cp .env.example
   ```
   
   Required API keys and credentials:
    - Google OAuth credentials (Client ID and Secret)
    - Google Cloud Vision API key
    - OpenAI API key
    - NextAuth URL and secret
    
   Make sure to populate all necessary variables in the environment file for the application to function correctly.

3. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚡ Features

Calendxr provides an AI-powered smart calendar experience with the following key features:

- **Image Input:** Create events using photos.
  - Take a photo of an event flyer or invitation
  - AI automatically extracts event details like date, time, location

- **AI Chatbot Assistant:**
  - Ask questions about your schedule in natural language
  - Get intelligent suggestions for organizing your calendar
  - Powered by advanced language model technology

- **Automated Event Suggestions:** 
  - AI detects potential events from available dates
  - Smart recommendations for scheduling based on your patterns

- **Direct Google Calendar Integration:**
  - Seamless sync with your Google Calendar
  - No database storage of your events - everything stays in your Google account

## 🔒 Privacy First Approach

At Calendxr, we take your privacy seriously:

- **No Database Storage:** We don't maintain a database of user information or calendar events. Everything syncs directly with your Google account.

- **Ephemeral Processing:** Your uploaded images for event creation are processed and then immediately discarded.

- **Minimal Permissions:** We only request the minimum Google Calendar permissions needed for the app to function.

- **Transparent Codebase:** Our entire application is open source, allowing you to verify our privacy claims and security practices.

- **No Chat History:** Each chat session with our AI assistant is discarded after you close it, leaving no persistent record of your interactions.

## 🛠 Built With

### Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the full-stack application
- [Vercel](https://vercel.com/) - Hosting platform
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

### APIs Used

- [Google Calendar API](https://developers.google.com/calendar) - For calendar integration and event management
- [Google Cloud Vision API](https://cloud.google.com/vision) - For image analysis and text extraction
- [OpenAI API](https://openai.com/api/) - For advanced AI processing and natural language understanding

## 🧠 Architecture

Calendxr follows a modern full-stack Next.js application architecture:

1. **Next.js Application:**
   - Server-side rendering for improved SEO and performance
   - Client-side React components for interactive UI elements
   - API routes for serverless backend functionality
   - NextAuth.js for authentication with Google OAuth

2. **Integration Layer:**
   - Direct integration with Google APIs
   - Secure API calls to third-party services

3. **Key Design Principles:**
   - Privacy by design - no unnecessary data storage
   - Responsive design for all devices
   - Accessibility compliance

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Dev Team

- **Miu Nicole Takagi** - *Project Manager* - [GitHub](https://github.com/mint-talltree)
- **Nobuhiro Oto** - *Fullstack* - [GitHub](https://github.com/nobu-h-o)
- **Ryota Tetsuka** - *Frontend* - [GitHub](https://github.com/rogue1starwars)
- **Jihun Park** - *Backend* - [GitHub](https://github.com/JihunPark03)
- **Atomu Naka** - *Backend* - [GitHub](https://github.com/Cardioid22)
- **Misaki Hara** - *Backend & Infra* - [GitHub](https://github.com/gostachan)

## 🙏 Acknowledgments

- Special thanks to our hackathon team for their dedication and creativity
- Huge appreciation to the [EGH](https://event.gaishishukatsu.com/hackathon/2025_march) organizers, judges, and fellow participants, as this project was originated there