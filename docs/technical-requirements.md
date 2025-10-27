# Baby Logbook - Technical Requirements

## 1. Functional Requirements

### 1.1 User Management (FR-1)

- FR-1.1 Support creation of admin and standard user accounts
- FR-1.2 Authenticate users via username/password
- FR-1.3 Maintain user sessions with configurable timeout (default: 7 days)
- FR-1.4 Support password reset functionality
- FR-1.5 Log user actions for audit trail
- FR-1.6 Restrict admin functions to admin role only

### 1.2 Baby Profile Management (FR-2)

- FR-2.1 Support multiple baby profiles per household
- FR-2.2 Store comprehensive birth and medical information
- FR-2.3 Support profile photo upload (max 5MB, JPEG/PNG/WebP)
- FR-2.4 Calculate baby's age dynamically from birth date
- FR-2.5 Support "expected baby" profiles with due date
- FR-2.6 Allow archiving and deletion of baby profiles

### 1.3 Vaccination Management (FR-3)

- FR-3.1 Auto-generate vaccination schedule based on birth date
- FR-3.2 Support Australian NIP and Aboriginal/Torres Strait Islander schedules
- FR-3.3 Track vaccination status (upcoming, due, overdue, completed, skipped)
- FR-3.4 Record detailed vaccination administration data (date, dose, batch, provider)
- FR-3.5 Support vaccination card photo upload
- FR-3.6 Generate vaccination certificate PDF
- FR-3.7 Calculate and display next vaccination due date

### 1.4 Appointment & Calendar Management (FR-4)

- FR-4.1 Provide month/week/day calendar views
- FR-4.2 Auto-generate standard Maternal & Child Health visit schedule
- FR-4.3 Support CRUD operations on appointments
- FR-4.4 Support recurring appointments
- FR-4.5 Color-code events by type (vaccination, health visit, doctor, custom)
- FR-4.6 Link appointments to vaccinations and measurements
- FR-4.7 Export calendar to iCalendar format (.ics)

### 1.5 Growth Tracking (FR-5)

- FR-5.1 Record weight, height, head circumference measurements
- FR-5.2 Generate growth charts with WHO percentile curves (3rd, 15th, 50th, 85th, 97th)
- FR-5.3 Support metric and imperial units with automatic conversion
- FR-5.4 Calculate BMI for children 2+ years
- FR-5.5 Provide growth trend analysis and velocity calculations
- FR-5.6 Flag measurements outside normal ranges
- FR-5.7 Export growth charts as PNG/PDF

### 1.6 Developmental Milestones (FR-6)

- FR-6.1 Provide age-appropriate milestone checklists (social, language, cognitive, physical)
- FR-6.2 Track milestone achievement dates
- FR-6.3 Support milestone photo uploads
- FR-6.4 Flag concerning developmental delays
- FR-6.5 Generate milestone timeline visualization
- FR-6.6 Support custom milestone creation

### 1.7 Reporting & Export (FR-7)

- FR-7.1 Generate comprehensive health summary PDF
- FR-7.2 Export data to JSON, CSV formats
- FR-7.3 Support selective data export (date range, specific baby, category)
- FR-7.4 Generate printable vaccination certificates
- FR-7.5 Email reports via SMTP (optional)

### 1.8 Backup & Restore (FR-8)

- FR-8.1 Create manual backups as timestamped ZIP files
- FR-8.2 Support automatic daily/weekly backups
- FR-8.3 Implement configurable backup retention policy (default: 30 days)
- FR-8.4 Restore from backup ZIP with data preview
- FR-8.5 Create pre-restore backup automatically

### 1.9 Reminder System (FR-9)

- FR-9.1 Display upcoming appointments on dashboard
- FR-9.2 Flag overdue vaccinations with visual alerts
- FR-9.3 Send email reminders (if SMTP configured)
- FR-9.4 Support reminder snooze/dismiss functionality

---

## 2. Non-Functional Requirements

### 2.1 Performance (NFR-1)

- NFR-1.1 Page load time < 2 seconds on local network
- NFR-1.2 API response time < 500ms for 95% of requests
- NFR-1.3 Chart rendering complete within 1 second
- NFR-1.4 Support up to 10 concurrent users
- NFR-1.5 Database queries optimized with proper indexing
- NFR-1.6 Image uploads process within 3 seconds

### 2.2 Scalability (NFR-2)

- NFR-2.1 Support up to 10 baby profiles per household
- NFR-2.2 Handle 1000+ vaccination records efficiently
- NFR-2.3 Handle 5000+ appointments without degradation
- NFR-2.4 Support 10,000+ growth measurements
- NFR-2.5 Database size not exceed 5GB for typical usage

### 2.3 Security (NFR-3)

- NFR-3.1 Hash all passwords using bcrypt (cost factor 12)
- NFR-3.2 Use secure, httpOnly cookies for sessions
- NFR-3.3 Require authentication for all API endpoints (except login/setup)
- NFR-3.4 Implement CSRF protection on state-changing operations
- NFR-3.5 Sanitize all user inputs to prevent XSS attacks
- NFR-3.6 Implement rate limiting (max 100 req/min per user, 5 login attempts)
- NFR-3.7 Validate file uploads for type and size
- NFR-3.8 Set database file permissions to 600 (owner read/write only)

### 2.4 Availability (NFR-4)

- NFR-4.1 Maintain 99% uptime on local network
- NFR-4.2 Implement health check endpoint (/health)
- NFR-4.3 Auto-restart on failure via Docker restart policy
- NFR-4.4 Gracefully handle database connection failures
- NFR-4.5 Provide meaningful error messages to users

### 2.5 Maintainability (NFR-5)

- NFR-5.1 Follow consistent code style (ESLint/Prettier configured)
- NFR-5.2 Document API using OpenAPI 3.0 specification
- NFR-5.3 Version-control database schema with migrations
- NFR-5.4 Implement comprehensive logging (info, warn, error levels)
- NFR-5.5 Build modular, reusable frontend components
- NFR-5.6 Achieve minimum 70% test coverage

### 2.6 Usability (NFR-6)

- NFR-6.1 Responsive UI for mobile, tablet, desktop
- NFR-6.2 Meet WCAG 2.1 AA accessibility standards
- NFR-6.3 Provide inline form validation with clear error messages
- NFR-6.4 Include contextual help tooltips
- NFR-6.5 Display guidance in empty states
- NFR-6.6 Show visual feedback for loading states

### 2.7 Compatibility (NFR-7)

- NFR-7.1 Support modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- NFR-7.2 Work on mobile browsers (iOS Safari, Chrome Mobile)
- NFR-7.3 Support Docker on amd64 and arm64 architectures
- NFR-7.4 Optional: Work offline after initial page load (PWA)

### 2.8 Portability (NFR-8)

- NFR-8.1 Store all data in portable formats (SQLite, JSON)
- NFR-8.2 Provide complete data export functionality
- NFR-8.3 Use platform-independent backup format
- NFR-8.4 Externalize configuration via environment variables

### 2.9 Localization (NFR-9)

- NFR-9.1 Support configurable date/time formats (DD/MM/YYYY, MM/DD/YYYY, 12h/24h)
- NFR-9.2 Support unit system selection (metric/imperial)
- NFR-9.3 Support timezone configuration
- NFR-9.4 Design for future internationalization (i18n) support

---

## 3. Technical Constraints

### 3.1 Technology Stack

- **Backend:** Node.js 20+, Express.js 4+, SQLite 3.45+, Sequelize ORM 6+
- **Frontend:** React 18+, Vite 5+, Tailwind CSS 3+, Recharts 2+
- **Deployment:** Docker 24+, Docker Compose 2.20+, Nginx (Alpine)

### 3.2 Infrastructure

- **Deployment:** Single Docker container
- **Database:** SQLite (file-based, no separate server)
- **Storage:** Docker volumes for data persistence
- **Network:** Local network access only (no internet required post-setup)

### 3.3 Resource Requirements

- **Minimum RAM:** 2GB
- **Storage:** 5GB minimum
- **CPU:** 2 cores recommended
- **Network:** Local network (100 Mbps+)

### 3.4 Data Requirements

- **Database Size:** < 5GB typical usage
- **File Uploads:** Max 10MB per file
- **Session Storage:** SQLite-based session store
- **Backup Size:** Full backup < 1GB typical

---

## 4. System Architecture

### 4.1 Architecture Pattern

Monolithic N-Tier Architecture in single Docker container

### 4.2 Layers

```
Presentation Layer (React SPA)
    ↓
API Layer (Express.js REST API)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories/ORM)
    ↓
Data Storage Layer (SQLite)
```

### 4.3 Key Components

- **Authentication:** Passport.js with local strategy
- **Session Management:** express-session with SQLite store
- **File Storage:** Local filesystem with organized directory structure
- **PDF Generation:** PDFKit
- **Image Processing:** Sharp
- **Charting:** Recharts (frontend), WHO percentile calculations (backend)
- **Scheduling:** node-cron for automatic backups
- **Email:** Nodemailer (optional)

---

## 5. API Requirements

### 5.1 API Design

- **Style:** RESTful
- **Format:** JSON
- **Authentication:** Session-based (cookies)
- **Base URL:** `/api/v1`

### 5.2 Key Endpoints

```
POST   /api/v1/auth/login
GET    /api/v1/babies
POST   /api/v1/babies
GET    /api/v1/babies/:id/vaccinations
POST   /api/v1/babies/:id/vaccinations/:vacId/complete
GET    /api/v1/appointments
GET    /api/v1/babies/:id/growth/charts/:type
POST   /api/v1/babies/:id/milestones/:milestoneId/achieve
GET    /api/v1/reports/health-summary/:babyId
POST   /api/v1/backups/create
```

### 5.3 Response Format

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-10-21T10:30:00Z"
}
```

---

## 6. Database Requirements

### 6.1 Database Engine

- **Type:** SQLite 3.45+
- **Location:** /data/baby-tracker.db
- **Migrations:** Sequelize migrations

### 6.2 Key Tables

- **users** - User accounts
- **household** - Household information
- **babies** - Baby profiles
- **vaccinations** - Vaccination records
- **appointments** - Calendar appointments
- **growth_records** - Growth measurements
- **milestones** - Developmental milestones
- **file_uploads** - File metadata
- **backups** - Backup history
- **audit_logs** - Activity logs
- **settings** - Application settings

### 6.3 Relationships

- One household → Many babies
- One baby → Many vaccinations, appointments, growth records, milestones
- One appointment → Optional growth record link

---

## 7. Security Requirements

### 7.1 Authentication

- Session-based with secure cookies
- Password hashing: bcrypt (cost 12)
- Session timeout: Configurable (default 7 days)
- Failed login throttling: Max 5 attempts per 15 minutes

### 7.2 Authorization

- Role-based access control (Admin, User)
- Admin-only functions: User management, system settings
- All users can view/edit all household data

### 7.3 Data Protection

- Input validation using Joi schemas
- XSS prevention via sanitization
- CSRF tokens on state-changing operations
- SQL injection prevention via parameterized queries (ORM)
- File upload validation (type, size, content)

### 7.4 Network Security

- Helmet.js security headers
- Rate limiting per IP and per user
- HTTPS support via reverse proxy (optional)
- httpOnly, secure cookies

---

## 8. Deployment Requirements

### 8.1 Docker Configuration

```yaml
Container:
  - Image: Node.js 20 Alpine
  - Port: 3000
  - Volumes: ./data, ./backups, ./config
  - Restart: unless-stopped
  - Health check: /health endpoint every 30s
```

### 8.2 Environment Variables

```
NODE_ENV=production
PORT=3000
TZ=Australia/Melbourne
DATABASE_PATH=/data/baby-tracker.db
SESSION_SECRET=[auto-generated]
BACKUP_RETENTION_DAYS=30
```

### 8.3 Volume Mounts

- **/data** - Database and uploads
- **/backups** - Automatic backups
- **/config** - Configuration overrides

---

## 9. Monitoring & Logging

### 9.1 Logging

- **Library:** Winston
- **Levels:** error, warn, info, debug
- **Destinations:** Console, file (optional)
- **Format:** JSON with timestamps

### 9.2 Health Checks

- **Endpoint:** GET /health
- **Response:** { "status": "ok", "timestamp": "..." }
- **Docker:** Health check every 30s

### 9.3 Audit Logging

- Track user actions (create, update, delete)
- Store in audit_logs table
- Include: user, action, entity, changes, IP, timestamp

---

## 10. Testing Requirements

### 10.1 Unit Tests

- Minimum 70% code coverage
- Test framework: Jest
- Mock external dependencies

### 10.2 Integration Tests

- API endpoint testing with Supertest
- Database operations testing
- File upload/download testing

### 10.3 E2E Tests (Optional)

- Critical user flows
- Setup wizard
- Baby profile creation
- Vaccination recording

---

## 11. Documentation Requirements

### 11.1 User Documentation

- Installation guide
- User manual
- FAQ
- Troubleshooting guide

### 11.2 Developer Documentation

- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Contributing guidelines
- Code comments (JSDoc)

### 11.3 Operational Documentation

- Deployment guide
- Backup/restore procedures
- Configuration reference
- Security best practices

---

## Summary

This application is a self-hosted, single-container, privacy-focused baby health tracker designed for home lab deployment. It prioritizes:

- **Privacy:** All data stored locally
- **Simplicity:** Single Docker container, zero-config database
- **Usability:** Intuitive UI with baby-friendly design
- **Completeness:** Full feature set for baby health tracking
- **Security:** Industry-standard security practices
- **Portability:** Easy backup and data export

**Target Users:** Parents/guardians managing health records for one or more children in a single household via self-hosted infrastructure.
