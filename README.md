# 🦕 Baby Logbook

A privacy-focused, self-hosted baby health management system. Track vaccinations, growth, milestones, and appointments all in one place - with all data stored locally on your own server.

## 🌟 Features

- **Vaccination Tracking** - Australian NIP schedule with automated reminders
- **Growth Charts** - WHO percentile curves for weight, height, and head circumference
- **Milestone Tracking** - Age-appropriate developmental milestone checklists
- **Appointment Calendar** - Schedule and manage health visits
- **Photo Uploads** - Store vaccination cards and milestone photos
- **PDF Reports** - Generate comprehensive health summaries and certificates
- **Data Export** - Export all data in portable formats (JSON, CSV)
- **Automatic Backups** - Scheduled backups with retention policies
- **Privacy First** - All data stored locally, never leaves your network

## 🏗️ Architecture

Single Docker container with:
- React 18 frontend (Vite + Tailwind CSS)
- Express.js backend API
- SQLite database
- Nginx reverse proxy

## 📋 Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- 2GB RAM minimum
- 5GB storage space

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/baby-logbook.git
   cd baby-logbook
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   ```
   http://localhost:3000
   ```

## 🛠️ Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
baby-logbook/
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── models/        # Database models (Sequelize)
│   │   ├── repositories/  # Data access layer
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── validators/    # Joi schemas
│   │   ├── utils/         # Helper functions
│   │   ├── jobs/          # Cron jobs (backups, reminders)
│   │   └── migrations/    # Database migrations
│   └── tests/             # Backend tests
│
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # State management (Zustand)
│   │   ├── services/     # API client services
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
├── docs/                 # Documentation
├── data/                 # Persistent data (gitignored)
├── backups/              # Automatic backups (gitignored)
├── config/               # Configuration overrides (gitignored)
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose configuration
├── nginx.conf           # Nginx reverse proxy config
└── .env.example         # Environment variables template
```

## 🔒 Security

- Session-based authentication with bcrypt password hashing
- CSRF protection on all state-changing operations
- Rate limiting (100 req/min per user, 5 login attempts)
- Input validation and XSS prevention
- Secure, httpOnly cookies
- Helmet.js security headers
- Database file permissions: 600 (owner only)

## 📊 Database Schema

- **users** - User accounts (admin, standard)
- **household** - Household information
- **babies** - Baby profiles and birth details
- **vaccinations** - Vaccination schedule and records
- **appointments** - Calendar events and health visits
- **growth_records** - Weight, height, head circumference
- **milestones** - Developmental milestones
- **file_uploads** - File metadata (photos, documents)
- **backups** - Backup history
- **audit_logs** - Activity tracking
- **settings** - Application configuration

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (to be implemented)
cd frontend
npm test
```

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md) (coming soon)
- [User Guide](docs/USER_GUIDE.md) (coming soon)
- [API Documentation](docs/API.md) (coming soon)
- [Development Guide](docs/DEVELOPMENT.md) (coming soon)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Theme

Baby Logbook features a friendly baby dinosaur theme with a pastel color palette:
- **Primary:** Mint Green (#A8E6CF)
- **Secondary:** Coral Pink (#FFB5B5)
- **Accent:** Sunny Yellow (#FFEAA7)
- **Purple:** Lavender (#DDA8E4)
- **Blue:** Sky Blue (#A8D5E6)

## 🙏 Acknowledgments

- WHO for growth chart percentile data
- Australian Department of Health for National Immunisation Program schedules
- All contributors and users of this project

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Made with ❤️ for parents and caregivers everywhere
