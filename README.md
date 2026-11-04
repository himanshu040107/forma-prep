# Forma Prep – AI-Powered Interview Preparation Platform

Forma Prep is an AI-powered interview preparation platform designed to help candidates prepare for technical interviews through personalized questions, AI-driven evaluations, and actionable feedback.

## 🚀 Features

- **AI-Generated Interview Questions:** Generate role-specific and technology-based interview questions using LLMs.
- **AI-Powered Evaluation:** Evaluate interview responses and receive detailed feedback.
- **Performance Reports:** Get personalized evaluation reports to identify strengths and areas for improvement.
- **Secure Authentication:** JWT-based authentication using HTTP-only cookies.
- **Interview Management:** Create and manage interview sessions and track previous evaluations.
- **Responsive UI:** User-friendly interface accessible across different devices.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

**AI Integration**
- LangChain
- Groq API

## 🏗️ Architecture

Forma Prep follows a modular full-stack architecture:

- React.js frontend communicates with the backend through REST APIs.
- Express.js handles API routing and business logic.
- MongoDB stores user information, interview sessions, and evaluation reports.
- LangChain integrates LLM capabilities through the Groq API to generate questions and evaluate responses.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HIMANSHU883-de/forma-prep.git
cd forma-prep
```

### 2. Install dependencies

Install dependencies separately in the frontend and backend directories.

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_ORIGIN=your_frontend_url
```

Configure the frontend API base URL to point to your backend server.

### 4. Run the application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

## 🔐 Security

- JWT-based authentication.
- HTTP-only cookies for secure token storage.
- Environment variables for sensitive credentials.
- Protected API routes.

## 🎯 Project Objective

The goal of Forma Prep is to make interview preparation more accessible and effective by leveraging Large Language Models to provide personalized interview experiences and meaningful performance insights.

## 👨‍💻 Author

**Himanshu**

- GitHub: [HIMANSHU883-de](https://github.com/HIMANSHU883-de)

---

*Built with React, Node.js, MongoDB, LangChain, and Groq API.*
