#!/bin/bash

# ClientManager Deploy Script
# Versão: 1.0.0
# Autor: ClientManager Team

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="client-manager"
APP_DIR="/home/clientmanager/app"
BACKUP_DIR="/home/clientmanager/backups"
LOG_FILE="/home/clientmanager/logs/deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
fi

# Create necessary directories
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

log "🚀 Starting deployment of $APP_NAME"

# Step 1: Pre-deployment checks
log "📋 Running pre-deployment checks..."

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    error "Application directory $APP_DIR does not exist"
fi

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    error "PostgreSQL is not running"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    error "PM2 is not installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js version must be 18 or higher. Current: $(node --version)"
fi

success "Pre-deployment checks passed"

# Step 2: Create backup
log "💾 Creating backup..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Backup database
if sudo -u postgres pg_dump client_manager > "$BACKUP_FILE"; then
    success "Database backup created: $BACKUP_FILE"
else
    error "Failed to create database backup"
fi

# Backup application files
APP_BACKUP="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"
if tar -czf "$APP_BACKUP" -C "$(dirname "$APP_DIR")" "$(basename "$APP_DIR")"; then
    success "Application backup created: $APP_BACKUP"
else
    warning "Failed to create application backup"
fi

# Step 3: Stop application
log "🛑 Stopping application..."

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 stop "$APP_NAME"
    success "Application stopped"
else
    warning "Application was not running"
fi

# Step 4: Update code
log "📥 Updating code..."

cd "$APP_DIR"

# Stash any local changes
git stash

# Pull latest changes
if git pull origin main; then
    success "Code updated successfully"
else
    error "Failed to update code"
fi

# Step 5: Install dependencies
log "📦 Installing dependencies..."

if npm ci --only=production; then
    success "Dependencies installed"
else
    error "Failed to install dependencies"
fi

# Step 6: Run database migrations
log "🗄️  Running database migrations..."

if npx prisma migrate deploy; then
    success "Database migrations completed"
else
    error "Database migrations failed"
fi

# Step 7: Generate Prisma client
log "🔧 Generating Prisma client..."

if npx prisma generate; then
    success "Prisma client generated"
else
    error "Failed to generate Prisma client"
fi

# Step 8: Build application
log "🏗️  Building application..."

if npm run build; then
    success "Application built successfully"
else
    error "Build failed"
fi

# Step 9: Start application
log "🚀 Starting application..."

if pm2 start ecosystem.config.js; then
    success "Application started"
else
    error "Failed to start application"
fi

# Step 10: Health check
log "🏥 Running health check..."

sleep 10  # Wait for app to start

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    success "Health check passed"
else
    error "Health check failed - rolling back"
    
    # Rollback
    log "🔄 Rolling back..."
    pm2 stop "$APP_NAME"
    
    # Restore database
    sudo -u postgres psql client_manager < "$BACKUP_FILE"
    
    # Restore application
    tar -xzf "$APP_BACKUP" -C "$(dirname "$APP_DIR")" --overwrite
    
    # Restart with old version
    cd "$APP_DIR"
    pm2 start ecosystem.config.js
    
    error "Deployment failed and rolled back"
fi

# Step 11: Cleanup old backups (keep last 5)
log "🧹 Cleaning up old backups..."

cd "$BACKUP_DIR"
ls -t backup_*.sql | tail -n +6 | xargs -r rm
ls -t app_backup_*.tar.gz | tail -n +6 | xargs -r rm

success "Old backups cleaned up"

# Step 12: Update PM2 process list
log "📝 Updating PM2 process list..."

pm2 save

success "PM2 process list updated"

# Step 13: Reload Nginx (if needed)
if command -v nginx &> /dev/null; then
    log "🔄 Reloading Nginx..."
    if sudo nginx -t && sudo systemctl reload nginx; then
        success "Nginx reloaded"
    else
        warning "Nginx reload failed"
    fi
fi

# Final success message
success "🎉 Deployment completed successfully!"

log "📊 Deployment summary:"
log "   - Backup created: $BACKUP_FILE"
log "   - Application backup: $APP_BACKUP"
log "   - Deployment time: $(date)"
log "   - Application status: $(pm2 describe "$APP_NAME" | grep status)"

# Send notification (optional)
if command -v curl &> /dev/null && [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ $APP_NAME deployed successfully at $(date)\"}" \
        "$SLACK_WEBHOOK_URL"
fi

log "🏁 Deploy script finished"

