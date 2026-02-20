# 🚀 Quick EC2 Deployment Guide

## Prerequisites on EC2

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2 serve
```

---

## Quick Setup Steps

### 1. Upload Project to EC2
```bash
# On your local machine
scp -r /path/to/namohomes-admin ubuntu@your-ec2-ip:/home/ubuntu/
```

### 2. SSH into EC2
```bash
ssh ubuntu@your-ec2-ip
cd /home/ubuntu/namohomes-admin
```

### 3. Update Configuration

**Edit `ecosystem.config.js`:**
- Update `cwd` path (line 7) to your actual path: `/home/ubuntu/namohomes-admin`
- Update `REACT_APP_API_URL` (line 15) to your production API URL

**OR update `src/apiConfig.js`:**
```javascript
const BASE_URL = "https://your-production-api-url.com";
```

### 4. Deploy
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**OR manually:**
```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions shown
```

---

## PM2 Commands

```bash
pm2 start ecosystem.config.js    # Start app
pm2 stop namohomes-admin         # Stop app
pm2 restart namohomes-admin      # Restart app
pm2 logs namohomes-admin         # View logs
pm2 status                       # Check status
pm2 monit                        # Monitor
```

---

## Nginx Setup (Optional)

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/namohomes-admin
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/namohomes-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Update Application

```bash
cd /home/ubuntu/namohomes-admin
git pull          # If using git
./deploy.sh       # Or run deployment steps manually
```

---

## Important Notes

1. **Update `ecosystem.config.js`**:
   - Line 7: Change `cwd` to your actual path
   - Line 15: Update `REACT_APP_API_URL` with production API URL

2. **Build First**: Always run `npm run build` before starting PM2

3. **Port**: App runs on port 3000 by default

4. **Firewall**: Allow port 3000 (or 80 if using Nginx)
   ```bash
   sudo ufw allow 3000/tcp
   ```

---

**Your app will be available at: `http://your-ec2-ip:3000`**

