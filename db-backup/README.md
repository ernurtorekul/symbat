# Database Transfer Package

This package contains everything you need to transfer your Smart Consultant Cosmetics database to another computer.

## 📁 Files Included

1. **`smart_consultant_cosmetics_backup.sql`** - Complete database backup (schema + data)
   - Size: ~1MB
   - Contains all tables, indexes, and data

2. **`smart_consultant_cosmetics_data.sql`** - Data-only backup (INSERT statements)
   - Use this if you already have the database schema set up

3. **`restore-database.sh`** - Automated restoration script
   - One-click database restoration
   - Includes safety checks and verification

## 🚀 How to Transfer to Another Computer

### Method 1: Quick Transfer (Recommended)

1. **Copy the entire `db-backup` folder** to your second computer:
   ```bash
   # On this computer
   zip -r db-backup.zip db-backup/

   # Transfer db-backup.zip to the other computer
   # Then unzip:
   unzip db-backup.zip
   ```

2. **On the second computer**, make sure you have:
   - PostgreSQL installed and running
   - Database user: postgres with password: postgres

3. **Run the restoration script**:
   ```bash
   cd db-backup
   ./restore-database.sh
   ```

### Method 2: Manual Transfer

1. **Set up PostgreSQL on the second computer**:
   ```bash
   # Start PostgreSQL
   brew services start postgresql  # macOS
   # or
   sudo systemctl start postgresql  # Linux

   # Create the database
   createdb -U postgres smart_consultant_cosmetics
   ```

2. **Restore the database**:
   ```bash
   psql -U postgres -d smart_consultant_cosmetics < smart_consultant_cosmetics_backup.sql
   ```

## 🔧 Database Configuration

The database expects these settings (same as your current setup):

- **Host**: localhost
- **Port**: 5432
- **Database**: smart_consultant_cosmetics
- **Username**: postgres
- **Password**: postgres

## 📊 What's Included in the Database

- **940 makeup products** from the Makeup API
- **9 makeup removers** (including Lancôme, DHC, Clinique, etc.)
- **All product categories** (lipstick, foundation, powder, etc.)
- **Quiz data and recommendations**
- **User data and preferences**

## ✅ Verification

After restoration, verify the data:
```sql
-- Check total products
SELECT COUNT(*) FROM products;  -- Should return 940

-- Check makeup removers
SELECT COUNT(*) FROM products WHERE "productCategory" = 'makeup_remover';  -- Should return 9

-- Check categories
SELECT "productCategory", COUNT(*) FROM products GROUP BY "productCategory";
```

## 🆘 Troubleshooting

**Issue**: "Database already exists"
```bash
# Drop and recreate
dropdb -U postgres smart_consultant_cosmetics
createdb -U postgres smart_consultant_cosmetics
```

**Issue**: "Permission denied"
```bash
# Make script executable
chmod +x restore-database.sh
```

**Issue**: "Connection refused"
- Make sure PostgreSQL is running
- Check that port 5432 is available
- Verify username/password are correct

## 🔄 Keeping Databases Synced

For future syncing, you can run this backup command anytime:
```bash
pg_dump -h localhost -U postgres -d smart_consultant_cosmetics > smart_consultant_cosmetics_backup.sql
```

---

**Created**: November 11, 2025
**Database Version**: PostgreSQL 16+
**Product Count**: 940 products + 9 makeup removers