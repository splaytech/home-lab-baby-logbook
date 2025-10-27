# 🚀 Quick Start Guide

Get Baby Logbook running in under 5 minutes!

## For Production (Docker)

```bash
# 1. Configure
cp .env.example .env
# Edit .env and set SESSION_SECRET (generate with: openssl rand -base64 32)

# 2. Start
docker-compose up -d

# 3. Access
# Open http://localhost:3000
```

## For Development

### Backend + Frontend Together

Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:3000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

## Project Status

✅ **Completed:**
- Docker setup (Dockerfile, docker-compose.yml)
- Environment configuration (.env.example)
- Nginx reverse proxy configuration
- Backend structure (Express.js + Sequelize)
- Frontend structure (React + Vite + Tailwind)
- Basic health check endpoint
- Logging configuration
- ESLint and Prettier setup

🚧 **Next Steps:**
1. Database models and migrations
2. Authentication system (Passport.js)
3. API endpoints
4. Frontend pages and components
5. Baby profile management
6. Vaccination tracking
7. Growth charts
8. Milestone tracking
9. Appointment calendar
10. Reports and exports

## Key Files

- `Dockerfile` - Multi-stage Docker build
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Reverse proxy configuration
- `.env.example` - Environment variables template
- `backend/src/index.js` - Backend entry point
- `frontend/src/App.jsx` - Frontend entry point

## Important Directories

```
backend/src/
├── config/       # Database and app configuration
├── models/       # Sequelize database models
├── services/     # Business logic
├── controllers/  # Request handlers
├── routes/       # API endpoints
├── middleware/   # Auth, validation, error handling
└── utils/        # Helper functions

frontend/src/
├── components/   # Reusable React components
├── pages/        # Page components
├── hooks/        # Custom React hooks
├── store/        # State management (Zustand)
├── services/     # API client
└── utils/        # Helper functions
```

## Development Commands

```bash
# Backend
npm run dev        # Start with nodemon
npm run lint       # Check code style
npm run test       # Run tests
npm run migrate    # Run database migrations

# Frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Check code style
npm run preview    # Preview production build

# Docker
docker-compose up -d          # Start in background
docker-compose logs -f        # View logs
docker-compose down           # Stop and remove
docker-compose restart        # Restart services
```

## Tech Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | React | 18.3+ |
| Build Tool | Vite | 5.2+ |
| Styling | Tailwind CSS | 3.4+ |
| Backend | Node.js | 20 LTS |
| Framework | Express.js | 4.19+ |
| Database | SQLite | 3.45+ |
| ORM | Sequelize | 6.37+ |
| Container | Docker | 24.0+ |
| Proxy | Nginx | 1.25+ |

## Need Help?

- Read the full [README.md](README.md)
- Check [SETUP.md](SETUP.md) for detailed instructions
- Review [docs/blueprint.md](docs/blueprint.md) for architecture
- Review [docs/technical-requirements.md](docs/technical-requirements.md) for specifications
