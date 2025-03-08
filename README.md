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
  - [Environment Setup](#environment-setup)
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
- [Docker](https://www.docker.com/) (optional, for containerized development)
- [Git](https://git-scm.com/)
- [Poetry](https://python-poetry.org/) (for Python dependency management)
- [Python](https://www.python.org/) (v3.9 or higher)
- [PostgreSQL](https://www.postgresql.org/) (for the database)

You will also need:
- A Google Cloud account with Calendar API and Vision API enabled
- OpenAI API key for certain AI functionalities
- Dify AI account for RAG chatbot implementation
- PostgreSQL connection string for database access

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nobu-h-o/Calendxr.git
   cd Calendxr
   ```

2. Set up environment variables:
   
   Both the frontend and backend directories have their own environment configurations:
    
   #### Frontend Environment
   Copy the example environment file and update it with your values:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
    
   #### Backend Environment
   Copy the example environment file and update it with your values:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Required API keys and credentials:
    - Google OAuth credentials (Client ID and Secret)
    - Google Cloud Vision API key
    - OpenAI API key
    - Dify API key and endpoint
    - NextAuth URL and secret
    - PostgreSQL database connection string
    
   Make sure to populate all necessary variables in both environment files for the application to function correctly.

3. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Choose one of the following development methods:

#### Using Docker (Recommended)

Run the entire application stack using Docker:
```bash
docker compose up --build
```

#### Running Frontend and Backend Separately

**For the frontend:**
```bash
cd frontend
npm install
npm run dev
```

**For the backend:**
```bash
cd backend
poetry update
poetry run uvicorn main:app --reload
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚡ Features

Calendxr provides an AI-powered smart calendar experience with the following key features:

- **Image Input:** Create events using photos.
  - Take a photo of an event flyer or invitation
  - AI automatically extracts event details like date, time, location

- **RAG-powered AI Chatbot Assistant:**
  - Ask questions about your schedule in natural language
  - Get intelligent suggestions for organizing your calendar
  - Powered by Dify's Retrieval-Augmented Generation technology

- **Automated Event Suggestions:** 
  - AI detects potential events from available dates
  - Smart recommendations for scheduling based on your patterns

- **Direct Google Calendar Integration:**
  - Seamless sync with your Google Calendar
  - Events stored both in your Google account and our secure database for enhanced features

- **Group Scheduling:**
  - Create and manage group events with multiple participants
  - Find optimal meeting times based on participants' availability
  - Send invitations and track responses
  - Collaborative editing of event details

## 🔒 Privacy First Approach

At Calendxr, we take your privacy seriously:

- **Secure Database Storage:** We use Prisma with PostgreSQL to securely store only the essential data needed for advanced features like group scheduling.

- **Ephemeral Processing:** Your uploaded images for event creation are processed and then immediately discarded.

- **Minimal Permissions:** We only request the minimum Google Calendar permissions needed for the app to function.

- **Transparent Codebase:** Our entire application is open source, allowing you to verify our privacy claims and security practices.

- **No Chat History:** Each chat session with our AI assistant is discarded after you close it, leaving no persistent record of your interactions.

## 🛠 Built With

### Tech Stack

- [Next.js](https://nextjs.org/) - The React Framework for building the frontend
- [FastAPI](https://fastapi.tiangolo.com/) - Backend API framework
- [Prisma](https://www.prisma.io/) - ORM for database access
- [PostgreSQL](https://www.postgresql.org/) - Relational database for data storage
- [Docker](https://www.docker.com/) - Containerization for consistent development and deployment
- [Vercel](https://vercel.com/) - Frontend hosting platform
- [AWS](https://aws.amazon.com/) - Backend server infrastructure
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [React Query](https://react-query.tanstack.com/) - Data fetching and state management
- [Poetry](https://python-poetry.org/) - Python dependency management for the backend

### APIs Used

- [Google Calendar API](https://developers.google.com/calendar) - For calendar integration and event management
- [Google Cloud Vision API](https://cloud.google.com/vision) - For image analysis and text extraction
- [OpenAI API](https://openai.com/api/) - For advanced AI processing and natural language understanding
- [Dify AI API](https://dify.ai/) - For AI chatbot integration and RAG implementation

## 🧠 Architecture

Calendxr follows a modern web application architecture:

1. **Frontend (Next.js):**
   - Server-side rendering for improved SEO and performance
   - Client-side React components for interactive UI elements
   - NextAuth.js for authentication with Google OAuth

2. **Backend Services:**
   - FastAPI microservices for specific functionality
   - Serverless functions for event processing
   - Prisma ORM for type-safe database access

3. **Database Layer:**
   - PostgreSQL for reliable data storage
   - Prisma migrations for database schema management
   - Efficient querying for group scheduling features

4. **Integration Layer:**
   - Direct integration with Google APIs
   - Secure API calls to third-party services

5. **Key Design Principles:**
   - Secure data storage with proper access controls
   - Responsive design for all devices
   - Accessibility compliance

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

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
- Huge appreciation to the hackathon organizers, judges, and fellow participants
- Thanks to the open source community for the amazing tools and libraries used in this project
- Google Cloud for providing the APIs that power our key features
- Dify AI for their support with the RAG chatbot implementation
