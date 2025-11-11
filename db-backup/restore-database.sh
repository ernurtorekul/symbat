#!/bin/bash

# Database Restoration Script
# Usage: ./restore-database.sh

set -e

echo "🔄 Starting database restoration..."

# Database configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="smart_consultant_cosmetics"
BACKUP_FILE="smart_consultant_cosmetics_backup.sql"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    echo "Please make sure the backup file is in the same directory as this script."
    exit 1
fi

echo "📁 Found backup file: $BACKUP_FILE"

# Check file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "📊 Backup file size: $BACKUP_SIZE"

# Prompt for confirmation
echo ""
echo "⚠️  WARNING: This will delete all existing data in the '$DB_NAME' database!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restoration cancelled."
    exit 1
fi

echo ""
echo "🗑️  Dropping existing database (if it exists)..."
PGPASSWORD=$DB_PASSWORD dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database didn't exist or was already dropped."

echo "📦 Creating new database..."
PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

echo "📥 Restoring data from backup..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < "$BACKUP_FILE"

echo ""
echo "✅ Database restoration completed successfully!"
echo ""
echo "🔍 Verifying restoration..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as total_products FROM products;" 2>/dev/null || echo "⚠️  Could not verify product count - please check manually."

echo ""
echo "🎉 Your database has been restored with all products and data!"
echo "📍 Database: $DB_NAME"
echo "🌐 Host: $DB_HOST:$DB_PORT"
echo "👤 User: $DB_USER"