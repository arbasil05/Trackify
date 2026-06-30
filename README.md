<div align="center">

# Trackify

### The smarter way to track academic credits — built for students, by students.

[![Stack](https://img.shields.io/badge/stack-MERN-339933?logo=node.js&logoColor=white)](#tech-stack)
[![Status](https://img.shields.io/badge/status-production-success)](#)
[![Users](https://img.shields.io/badge/users-1000%2B-blue)](#results--impact)
[![Deployment](https://img.shields.io/badge/deployment-Nginx-009639?logo=nginx&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#)

[Live Demo](#) · [Report a Bug](#) · [Request a Feature](#)

</div>

---

## Why Trackify Exists

Tracking academic credits across semesters, electives, and varying credit structures is a mess of spreadsheets, mark sheets, and guesswork — for students trying to figure out if they're on pace to graduate, and for institutions trying to verify it. Trackify replaces that mess with a single source of truth: upload your data once, and get real-time, accurate credit tracking with zero manual computation.

It's currently live in production, serving **1,000+ active users** with consistent API traffic — not a classroom prototype, a real tool people actually use.

---

## Features

| | |
|---|---|
| **Secure Auth** | JWT-based authentication with protected routes and session handling |
| **Real-Time Calculation** | Credits and CGPA recompute instantly as data is added or updated |
| **Analytics Dashboard** | Visual breakdown of credit completion, progress, and category-wise distribution |
| **Smart Data Upload** | Structured upload flow for semester-wise course and credit data |
| **Scalable REST API** | Clean, optimized Express endpoints designed for growth, not just demo data |

---

## Tech Stack

**Frontend**
React.js · Tailwind CSS · Axios

**Backend**
Node.js · Express.js · MongoDB · Mongoose

**Auth & Security**
JWT · bcrypt · CORS · dotenv


---

## Getting Started

### Prerequisites
- Node.js v16+
- npm
- MongoDB (local or Atlas)


### Local Setup

```bash
# Clone the repo
git clone https://github.com/arbasil05/trackify.git
cd trackify

# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment variables
cp .env.example .env
# Add your MONGO_URI, JWT_SECRET, etc.

# Run backend
cd server && npm run dev

# Run frontend
cd client && npm start
```

---

## Screenshots

### Student Dashboard
<img width="1905" height="864" alt="Dashboard View" src="https://github.com/user-attachments/assets/0e291bee-0017-403e-b2e9-e6aafea1b1aa" />

### Upload Flow
<img width="1879" height="852" alt="Upload Page 1" src="https://github.com/user-attachments/assets/76c189d7-f545-4d55-ae4c-e8f23c8ce47e" />
<img width="1876" height="847" alt="Upload Page 2" src="https://github.com/user-attachments/assets/e531d1f1-23f6-4e8a-9d04-a5f10e393058" />

---

## Results & Impact

- **1,000+ users** onboarded since launch, with sustained real-world API traffic
- Eliminated manual credit-tracking errors across diverse elective and course structures
- Gave students continuous visibility into graduation-readiness instead of end-of-semester surprises
- Demonstrated that a student-built tool can hold up to production-level load and real user behavior, not just a grading rubric

> Metrics will continue to be updated as usage data grows post-deployment.

---

## Team

Built and maintained by **[Basil](https://arbasil.me)** ([@arbasil05](https://github.com/arbasil05)) alongside **Visalan H**, **Aaron H**, **Mohammed Surjun**, and **Renusri Naraharashetty**.

---

## License

This project is licensed under the MIT License.
