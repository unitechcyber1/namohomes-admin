# EC2 Deployment Guide for Namohomes Admin

## Prerequisites

1. EC2 instance running Ubuntu/Linux
2. Node.js and npm installed
3. PM2 installed globally
4. Nginx (optional, for reverse proxy)

---

## Step 1: Install Dependencies on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install serve (for serving React build)
sudo npm install -g serve
```

---

## Step 2: Clone/Upload Project to EC2

```bash
# Create project directory
mkdir -p /home/ubuntu/namohomes-admin
cd /home/ubuntu/namohomes-admin

# Upload your project files here (via git, scp, or other method)
# Or clone from repository:
# git clone <your-repo-url> .
```

---

## Step 3: Install Project Dependencies

```bash
cd /home/ubuntu/namohomes-admin
npm install
```

---

## Step 4: Configure Environment Variables

### Option A: Update ecosystem.config.js
Edit `ecosystem.config.js` and update:
- `cwd`: Your actual project path
- `REACT_APP_API_URL`: Your production API URL

### Option B: Create .env file
```bash
# Create .env file
nano .env
```

Add:
```
REACT_APP_API_URL=https://your-production-api-url.com
```

**Note:** If using .env, update `apiConfig.js` to use `process.env.REACT_APP_API_URL`

---

## Step 5: Build the Application

```bash
cd /home/ubuntu/namohomes-admin
npm run build
```

This creates the `build/` folder with production-ready files.

---

## Step 6: Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Or use npm script
npm run pm2:start

# Check status
pm2 status

# View logs
pm2 logs namohomes-admin
# Or use npm script
npm run pm2:logs
```

---

## Step 7: Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup

# Save current PM2 process list
pm2 save
```

---

## Step 8: Configure Nginx (Optional but Recommended)

### Install Nginx
```bash
sudo apt install nginx -y
```

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/namohomes-admin
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/namohomes-admin /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 9: Configure Firewall (UFW)

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (if using SSL)
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

---

## PM2 Management Commands

```bash
# Start application
pm2 start ecosystem.config.js
# or: npm run pm2:start

# Stop application
pm2 stop namohomes-admin
# or: npm run pm2:stop

# Restart application
pm2 restart namohomes-admin
# or: npm run pm2:restart

# Delete application
pm2 delete namohomes-admin
# or: npm run pm2:delete

# View logs
pm2 logs namohomes-admin
# or: npm run pm2:logs

# Monitor
pm2 monit

# View status
pm2 status

# Save current process list
pm2 save
```

---

## Updating the Application

```bash
# 1. Pull latest changes (if using git)
git pull origin main

# 2. Install new dependencies (if any)
npm install

# 3. Rebuild the application
npm run build

# 4. Restart PM2
pm2 restart namohomes-admin
# or: npm run pm2:restart
```

---

## Troubleshooting

### Check PM2 Status
```bash
pm2 status
pm2 logs namohomes-admin
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check Port 3000
```bash
sudo netstat -tulpn | grep 3000
```

### View Application Logs
```bash
# PM2 logs
pm2 logs namohomes-admin --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (Let's Encrypt recommended)
- [ ] Environment variables set securely
- [ ] .env file not committed to git
- [ ] PM2 running as non-root user
- [ ] Regular backups configured

---

## File Structure

```
/home/ubuntu/namohomes-admin/
├── build/                    # Production build (created by npm run build)
├── node_modules/             # Dependencies
├── public/                   # Public assets
├── src/                      # Source code
├── ecosystem.config.js       # PM2 configuration
├── package.json              # Project dependencies
└── .env                      # Environment variables (not in git)
```

---

## Important Notes

1. **Update ecosystem.config.js**:
   - Change `cwd` to your actual deployment path
   - Update `REACT_APP_API_URL` with your production API URL

2. **Build Before Starting**:
   - Always run `npm run build` before starting PM2
   - PM2 serves the `build/` folder, not the source code

3. **Port Configuration**:
   - Default port is 3000
   - Change in ecosystem.config.js if needed
   - Update Nginx config if port changes

4. **Environment Variables**:
   - Set in ecosystem.config.js `env` section
   - Or use .env file (requires code changes)

---

## Quick Start Commands

```bash
# Initial setup
cd /home/ubuntu/namohomes-admin
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Daily operations
pm2 restart namohomes-admin    # Restart app
pm2 logs namohomes-admin        # View logs
pm2 status                      # Check status
```

---

**Your application should now be running on port 3000 (or through Nginx on port 80)!**

