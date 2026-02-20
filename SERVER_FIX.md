# Server Dependency Fix

## Issue Fixed
The `immutable` package was set to version `^5.0.0-beta.4` which conflicts with `react-draft-wysiwyg` and `html-to-draftjs` that require `immutable@3.x.x || 4.x.x`.

## Solution Applied
✅ Updated `package.json` to use `immutable@^4.3.7` (compatible version)

## Steps to Fix on Server

### Option 1: Clean Install (Recommended)
```bash
cd /home/ubuntu/namohomes-admin

# Remove old dependencies
rm -rf node_modules package-lock.json

# Pull latest changes (if using git)
git pull origin shivam

# Install dependencies
npm install

# Build the application
npm run build

# Restart PM2
pm2 restart ecosystem.config.js
```

### Option 2: Quick Fix (If Option 1 doesn't work)
```bash
cd /home/ubuntu/namohomes-admin

# Install with legacy peer deps flag (temporary workaround)
npm install --legacy-peer-deps

# Build the application
npm run build

# Restart PM2
pm2 restart ecosystem.config.js
```

### Option 3: Using Updated Deploy Script
If you've pulled the latest changes:
```bash
cd /home/ubuntu/namohomes-admin
chmod +x deploy.sh
./deploy.sh
```

## Verification
After installation, verify it worked:
```bash
npm list immutable
# Should show: immutable@4.3.7 (or similar 4.x version)
```

## What Changed
- **package.json**: `immutable` version changed from `^5.0.0-beta.4` to `^4.3.7`
- **deploy.sh**: Updated to clean install dependencies

## Notes
- The `immutable@4.3.7` is the latest stable 4.x version and is fully compatible with `react-draft-wysiwyg@1.15.0`
- This fix resolves the peer dependency conflict permanently
- No code changes needed - only dependency version update

