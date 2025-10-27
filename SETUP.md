# Setup Guide for Baby Logbook

This guide will help you get the Baby Logbook up and running.

## Prerequisites Check

Before starting, ensure you have:

- [ ] Docker 24.0+ installed (`docker --version`)
- [ ] Docker Compose 2.20+ installed (`docker-compose --version`)
- [ ] At least 2GB RAM available
- [ ] At least 5GB free disk space

## Initial Setup

### Step 1: Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Generate a secure session secret:
   ```bash
   # On Linux/Mac:
   openssl rand -base64 32

   # On Windows PowerShell:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```

3. Edit `.env` and set the `SESSION_SECRET` value

4. Adjust other settings as needed (timezone, backup retention, etc.)

### Step 2: Build and Start

```bash
# Build and start the container
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

Or if you changed the port in `.env`:
```
http://localhost:YOUR_PORT
```

## Development Setup

If you want to run the application in development mode with hot-reload:

### Backend Development

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` with API proxy to backend

## Troubleshooting

### Container won't start

1. Check Docker is running:
   ```bash
   docker info
   ```

2. Check for port conflicts:
   ```bash
   # On Linux/Mac
   lsof -i :3000

   # On Windows
   netstat -ano | findstr :3000
   ```

3. View container logs:
   ```bash
   docker-compose logs
   ```

### Database issues

1. Stop containers:
   ```bash
   docker-compose down
   ```

2. Remove data directory (⚠️ This will delete all data):
   ```bash
   rm -rf data/
   ```

3. Restart:
   ```bash
   docker-compose up -d
   ```

### Permission issues (Linux/Mac)

If you encounter permission errors with data directories:

```bash
sudo chown -R $USER:$USER data/ backups/ config/
```

## Next Steps

1. Complete the initial setup wizard (coming soon)
2. Create your first baby profile
3. Configure backup settings
4. Set up SMTP for email notifications (optional)

## Useful Commands

```bash
# Stop the application
docker-compose stop

# Start the application
docker-compose start

# Restart the application
docker-compose restart

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs -f baby-tracker

# Execute commands in container
docker-compose exec baby-tracker sh

# Rebuild after code changes
docker-compose up -d --build
```

## Data Backup

Your data is stored in the following directories:
- `./data/` - Database and uploaded files
- `./backups/` - Automatic backups
- `./config/` - Configuration overrides

**Important:** Back up these directories regularly!

## Updating

To update to a new version:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Review the troubleshooting section above
3. Open an issue on GitHub with details and logs
