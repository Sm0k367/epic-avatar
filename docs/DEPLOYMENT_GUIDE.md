# 🚀 Deployment Guide

Complete guide for deploying AI Avatar to production.

## Table of Contents

- [Heroku](#heroku)
- [AWS](#aws)
- [Google Cloud Platform](#google-cloud-platform)
- [Azure](#azure)
- [Docker](#docker)
- [VPS/Dedicated Server](#vpsdedicated-server)

---

## Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create Heroku app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set D_ID_API_KEY=your_key
   heroku config:set ELEVENLABS_API_KEY=your_key
   ```

3. **Create Procfile**
   ```bash
   echo "web: python backend/server.py" > Procfile
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Open app**
   ```bash
   heroku open
   ```

---

## AWS

### Using Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init -p python-3.8 ai-avatar
   ```

3. **Create environment**
   ```bash
   eb create ai-avatar-env
   ```

4. **Set environment variables**
   ```bash
   eb setenv OPENAI_API_KEY=your_key
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Using EC2

1. **Launch EC2 instance** (Ubuntu 20.04)
2. **SSH into instance**
3. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```
4. **Clone and setup**
   ```bash
   git clone https://github.com/Sm0k367/epic-avatar.git
   cd epic-avatar
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
5. **Configure Nginx** (see nginx.conf below)
6. **Run with systemd** (see systemd service below)

---

## Google Cloud Platform

### Using App Engine

1. **Create app.yaml**
   ```yaml
   runtime: python38
   entrypoint: python backend/server.py
   
   env_variables:
     OPENAI_API_KEY: "your_key"
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   ```

### Using Cloud Run

1. **Create Dockerfile** (see Docker section)
2. **Build and push**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/ai-avatar
   ```
3. **Deploy**
   ```bash
   gcloud run deploy --image gcr.io/PROJECT_ID/ai-avatar
   ```

---

## Azure

### Using App Service

1. **Create App Service**
   ```bash
   az webapp up --name ai-avatar --runtime "PYTHON:3.8"
   ```

2. **Configure**
   ```bash
   az webapp config appsettings set --settings OPENAI_API_KEY=your_key
   ```

3. **Deploy**
   ```bash
   git push azure main
   ```

---

## Docker

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "backend/server.py"]
```

### Build and Run

```bash
# Build image
docker build -t ai-avatar .

# Run container
docker run -p 5000:5000 \
  -e OPENAI_API_KEY=your_key \
  -e D_ID_API_KEY=your_key \
  ai-avatar
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  ai-avatar:
    build: .
    ports:
      - "5000:5000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - D_ID_API_KEY=${D_ID_API_KEY}
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

## VPS/Dedicated Server

### Nginx Configuration

Create `/etc/nginx/sites-available/ai-avatar`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/ai-avatar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Systemd Service

Create `/etc/systemd/system/ai-avatar.service`:
```ini
[Unit]
Description=AI Avatar Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ai-avatar
Environment="PATH=/var/www/ai-avatar/venv/bin"
ExecStart=/var/www/ai-avatar/venv/bin/python backend/server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ai-avatar
sudo systemctl start ai-avatar
sudo systemctl status ai-avatar
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

Always set these in production:

```env
OPENAI_API_KEY=your_key
D_ID_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
HOST=0.0.0.0
PORT=5000
DEBUG=False
```

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set DEBUG=False
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Backup configuration

---

## Monitoring

### Health Check

```bash
curl http://your-domain.com/health
```

### Logs

```bash
# Systemd
sudo journalctl -u ai-avatar -f

# Docker
docker logs -f ai-avatar

# Heroku
heroku logs --tail
```

---

## Scaling

### Horizontal Scaling

Use load balancer with multiple instances:
- AWS: Application Load Balancer
- GCP: Cloud Load Balancing
- Azure: Load Balancer

### Vertical Scaling

Increase instance resources:
- More CPU cores
- More RAM
- Faster storage

---

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

### Permission denied
```bash
sudo chown -R www-data:www-data /var/www/ai-avatar
```

### WebSocket not working
- Check proxy configuration
- Ensure WebSocket upgrade headers
- Verify firewall allows WebSocket

---

## Support

For deployment help:
- GitHub Issues
- Email: epictechai@gmail.com
