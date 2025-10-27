# Baby Logbook - Project Blueprint

## 📋 Project Overview

- **Name:** Baby Logbook
- **Type:** Self-Hosted Web Application
- **Architecture:** Monolithic (Single Docker Container)
- **Target Users:** Parents managing baby health records at home
- **Deployment:** Docker on home lab servers

## 🎯 Project Goals

- **Privacy-First:** All health data stored locally, never leaves the home network
- **Comprehensive Tracking:** Vaccinations, growth, appointments, milestones in one place
- **Easy Deployment:** Single `docker-compose up` command to run
- **User-Friendly:** Baby dinosaur-themed interface that's delightful to use
- **Data Portability:** Export and backup all data easily

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         Docker Container                │
│  ┌────────────────────────────────┐    │
│  │   Nginx (Reverse Proxy)        │    │
│  └──────────┬─────────────────────┘    │
│             │                           │
│  ┌──────────▼─────────────────────┐    │
│  │   React Frontend (SPA)         │    │
│  └──────────┬─────────────────────┘    │
│             │                           │
│  ┌──────────▼─────────────────────┐    │
│  │   Express.js API               │    │
│  └──────────┬─────────────────────┘    │
│             │                           │
│  ┌──────────▼─────────────────────┐    │
│  │   SQLite Database              │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │
         ▼
   Docker Volumes
   (data, backups, config)
```

## 🛠️ Technology Stack

| Layer      | Technology       | Version | Rationale                  |
|------------|-----------------|---------|----------------------------|
| Frontend   | React           | 18.3+   | Component-based, modern    |
| Build Tool | Vite            | 5.2+    | Fast dev server            |
| UI Framework | Tailwind CSS  | 3.4+    | Utility-first styling      |
| Charts     | Recharts        | 2.12+   | React-native charts        |
| Backend    | Node.js         | 20 LTS  | Mature ecosystem           |
| Framework  | Express.js      | 4.19+   | Minimal, flexible          |
| Database   | SQLite          | 3.45+   | Zero-config, file-based    |
| ORM        | Sequelize       | 6.37+   | Feature-rich migrations    |
| Auth       | Passport.js     | 0.7+    | Proven authentication      |
| Container  | Docker          | 24.0+   | Standard containerization  |
| Web Server | Nginx           | 1.25+   | Reverse proxy, static files|

## 📊 Core Features

### Phase 1: Foundation (Weeks 1-2)

- ✅ Docker containerization
- ✅ User authentication & authorization
- ✅ Household profile setup
- ✅ Database schema & migrations
- ✅ Basic UI layout with dinosaur theme

### Phase 2: Baby Management (Weeks 3-4)

- ✅ Create/edit/delete baby profiles
- ✅ Birth details & medical history
- ✅ Photo uploads
- ✅ Multiple baby support
- ✅ Baby selector/switcher

### Phase 3: Vaccination Tracker (Weeks 5-6)

- ✅ Auto-generate Australian NIP schedule
- ✅ Vaccination timeline view
- ✅ Record vaccination details
- ✅ Upload vaccination cards
- ✅ Status tracking (upcoming/due/overdue/completed)
- ✅ Generate PDF certificate

### Phase 4: Calendar & Appointments (Weeks 7-8)

- ✅ Full calendar component (month/week/day views)
- ✅ Auto-generate health visit schedule
- ✅ Create/edit appointments
- ✅ Reminders system
- ✅ Color-coded event types
- ✅ Export to iCalendar

### Phase 5: Growth Tracking (Weeks 9-10)

- ✅ Record measurements (weight, height, head circumference)
- ✅ WHO percentile charts
- ✅ Growth trend analysis
- ✅ Metric/imperial unit conversion
- ✅ BMI calculation (2+ years)
- ✅ Export charts as PNG/PDF

### Phase 6: Milestones (Weeks 11-12)

- ✅ Age-based milestone checklists
- ✅ Mark achievements with dates
- ✅ Upload milestone photos
- ✅ Timeline visualization
- ✅ Flag concerning delays
- ✅ Custom milestones

### Phase 7: Reports & Export (Week 13)

- ✅ Health summary PDF
- ✅ Vaccination certificate
- ✅ Growth report with charts
- ✅ Data export (JSON/CSV)
- ✅ Email reports (optional)

### Phase 8: Backup & Settings (Week 14)

- ✅ Manual backup (ZIP)
- ✅ Automatic scheduled backups
- ✅ Restore from backup
- ✅ Settings management
- ✅ User management (admin)

### Phase 9: Polish & Testing (Weeks 15-16)

- ✅ UI/UX refinements
- ✅ Accessibility improvements
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Documentation
- ✅ Testing (unit, integration, E2E)

## 📁 Project Structure

```
baby-health-tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Database models (Sequelize)
│   │   ├── repositories/    # Data access layer
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── validators/      # Joi schemas
│   │   ├── utils/           # Helper functions
│   │   ├── jobs/            # Cron jobs (backups, reminders)
│   │   ├── seeders/         # Seed data (vaccination schedules)
│   │   └── migrations/      # Database migrations
│   ├── tests/               # Backend tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management (Zustand)
│   │   ├── services/        # API client services
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images, fonts, styles
│   └── package.json
│
├── docs/                    # Documentation
│   ├── INSTALLATION.md
│   ├── USER_GUIDE.md
│   ├── API.md
│   └── DEVELOPMENT.md
│
├── .github/
│   └── workflows/           # CI/CD pipelines
│
├── data/                    # Persistent data (gitignored)
├── backups/                 # Backups (gitignored)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

## 🗄️ Database Schema

### Core Tables

- **users** → User accounts (admin, standard)
- **household** → Household info & parent details
- **babies** → Baby profiles & birth details
- **vaccinations** → Vaccination schedule & records
- **appointments** → Calendar events & health visits
- **growth_records** → Weight, height, head circumference
- **milestones** → Developmental milestones
- **file_uploads** → File metadata (photos, docs)
- **backups** → Backup history
- **audit_logs** → Activity tracking
- **settings** → Application configuration

### Key Relationships

```
household (1) ──→ (N) babies
babies (1) ──→ (N) vaccinations
babies (1) ──→ (N) appointments
babies (1) ──→ (N) growth_records
babies (1) ──→ (N) milestones
```

## 🔌 API Design

### Authentication

```
POST   /api/v1/auth/setup           # Initial setup
POST   /api/v1/auth/login           # Login
POST   /api/v1/auth/logout          # Logout
GET    /api/v1/auth/session         # Check session
```

### Babies

```
GET    /api/v1/babies               # List all babies
POST   /api/v1/babies               # Create baby
GET    /api/v1/babies/:id           # Get baby details
PUT    /api/v1/babies/:id           # Update baby
DELETE /api/v1/babies/:id           # Delete baby
```

### Vaccinations

```
GET    /api/v1/babies/:id/vaccinations              # List
POST   /api/v1/babies/:id/vaccinations/generate     # Generate schedule
PATCH  /api/v1/babies/:id/vaccinations/:vid/complete # Mark complete
GET    /api/v1/babies/:id/vaccinations/certificate  # PDF certificate
```

### Appointments

```
GET    /api/v1/appointments          # List (with filters)
POST   /api/v1/appointments          # Create
PUT    /api/v1/appointments/:id      # Update
DELETE /api/v1/appointments/:id      # Delete
GET    /api/v1/appointments/calendar # Calendar data
```

### Growth

```
GET    /api/v1/babies/:id/growth               # List records
POST   /api/v1/babies/:id/growth               # Add record
GET    /api/v1/babies/:id/growth/charts/:type  # Chart data
GET    /api/v1/babies/:id/growth/analysis      # Growth analysis
```

### Milestones

```
GET    /api/v1/babies/:id/milestones              # List
POST   /api/v1/babies/:id/milestones/generate    # Generate from templates
PATCH  /api/v1/babies/:id/milestones/:mid/achieve # Mark achieved
GET    /api/v1/babies/:id/milestones/timeline    # Timeline data
```

## 🔒 Security Implementation

### Authentication & Authorization

- Session-based auth with express-session
- Password hashing with bcrypt (cost factor 12)
- Role-based access control (Admin, User)
- Session timeout: 7 days (configurable)

### Input Protection

- Joi validation schemas for all inputs
- Sanitize HTML to prevent XSS
- Parameterized queries (ORM handles SQL injection)
- File upload restrictions (type, size, content validation)

### Network Security

- Helmet.js security headers
- CSRF protection on state-changing operations
- Rate limiting (100 req/min general, 5 login attempts)
- httpOnly, secure cookies

### Data Security

- Database file permissions: 600 (owner only)
- All data stored locally (no cloud)
- Audit logging for accountability
- Regular automated backups

## 🎨 UI/UX Design Principles

### Theme: Baby Dinosaurs

- Friendly dinosaur mascots throughout the app
- Pastel color palette (mint, coral, lavender, yellow)
- Rounded corners and soft shadows
- Playful but professional

### Color Scheme

- **Primary:** #A8E6CF (Mint Green)
- **Secondary:** #FFB5B5 (Coral Pink)
- **Accent:** #FFEAA7 (Sunny Yellow)
- **Purple:** #DDA8E4 (Lavender)
- **Blue:** #A8D5E6 (Sky Blue)

### Typography

- **Headings:** "Nunito" (rounded, friendly)
- **Body:** "Inter" (readable, clean)
- **Minimum 16px** for accessibility

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly tap targets (44x44px minimum)

## 🚀 Deployment

### Prerequisites

- Docker 24.0+
- Docker Compose 2.20+
- 2GB RAM minimum
- 5GB storage
- Local network access

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/baby-health-tracker.git
cd baby-health-tracker

# Configure
cp .env.example .env
nano .env  # Edit as needed

# Deploy
docker-compose up -d

# Access
http://localhost:3000
```

### Environment Variables

```env
NODE_ENV=production
PORT=3000
TZ=Australia/Melbourne
DATABASE_PATH=/data/baby-tracker.db
SESSION_SECRET=auto-generated-if-not-set
BACKUP_RETENTION_DAYS=30
SMTP_ENABLED=false
```

### Docker Volumes

```
./data     → /data      (database, uploads)
./backups  → /backups   (automatic backups)
./config   → /config    (configuration overrides)
```

## 🧪 Testing Strategy

### Unit Tests (Backend)

- Services layer (business logic)
- Utilities (age calculation, unit conversion, percentile calculations)
- Target: 70% coverage

### Integration Tests (Backend)

- API endpoints with Supertest
- Database operations
- File upload/download flows

### Component Tests (Frontend)

- React components with React Testing Library
- User interactions
- Form validations

### E2E Tests (Optional)

- Critical user flows
- Setup wizard
- Create baby → Record vaccination → View chart

### Tools

- **Backend:** Jest, Supertest
- **Frontend:** Jest, React Testing Library
- **E2E:** Playwright (optional)

## 📚 Documentation Plan

### User Documentation

- README.md - Overview, quick start
- docs/INSTALLATION.md - Detailed installation
- docs/USER_GUIDE.md - Feature walkthroughs
- docs/FAQ.md - Common questions
- docs/TROUBLESHOOTING.md - Problem solving

### Developer Documentation

- docs/API.md - API reference (OpenAPI)
- docs/DEVELOPMENT.md - Setup dev environment
- docs/DATABASE.md - Schema documentation
- CONTRIBUTING.md - Contribution guidelines
- Inline JSDoc comments in code

### Operational Documentation

- docs/DEPLOYMENT.md - Production deployment
- docs/BACKUP.md - Backup/restore procedures
- docs/SECURITY.md - Security best practices
- docs/UPGRADE.md - Version upgrade guide

## 📈 Success Metrics

### Technical Metrics

- ✅ Page load < 2s
- ✅ API response < 500ms (95th percentile)
- ✅ 99% uptime
- ✅ 70%+ test coverage
- ✅ Zero critical security vulnerabilities

### User Experience Metrics

- ✅ Setup completed in < 5 minutes
- ✅ Intuitive navigation (no help docs needed for basic tasks)
- ✅ WCAG 2.1 AA compliant
- ✅ Mobile-responsive

### Feature Completeness

- ✅ All Phase 1-9 features implemented
- ✅ Australian NIP schedule up-to-date
- ✅ WHO growth charts accurate
- ✅ Data export/backup working
