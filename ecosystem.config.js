module.exports = {
  apps: [
    {
      name: 'namohomes-admin',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: '/home/ubuntu/namohomes-admin', // ⚠️ UPDATE THIS to your actual deployment path on EC2
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // ⚠️ UPDATE THIS with your production API URL
        REACT_APP_API_URL: 'https://your-production-api-url.com',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Auto-restart on crash
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};

