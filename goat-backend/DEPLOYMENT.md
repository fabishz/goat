# DEPLOYMENT.md

## Quick Start Deployment Guide

### Prerequisites
- Neon PostgreSQL database (free tier)
- GitHub account
- Render/Railway/Fly.io account

### Step 1: Prepare Environment
```bash
# Generate secret key
openssl rand -hex 32

# Copy and fill .env
cp .env.example .env
```

### Step 2: Deploy to Render

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `goat-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   ```
   DATABASE_URL=<your-neon-postgres-url>
   SECRET_KEY=<generated-secret-key>
   ENVIRONMENT=production
   DEBUG=false
   BACKEND_CORS_ORIGINS=https://your-frontend.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~2-3 minutes)

### Step 3: Verify Deployment
```bash
# Test health endpoint
curl https://your-app.onrender.com/api/v1/health

# Expected response
{"status":"healthy","database":"connected"}
```

### Troubleshooting

**Database Connection Failed**
- Check `DATABASE_URL` format
- Ensure Neon database allows external connections
- Verify SSL is enabled

**500 Internal Server Error**
- Check Render logs for errors
- Verify all environment variables are set
- Check database migrations ran successfully

**CORS Errors**
- Verify `BACKEND_CORS_ORIGINS` includes your frontend domain
- Include protocol (`https://`)

### Monitoring
- **Logs**: Render Dashboard → Logs tab
- **Metrics**: Render Dashboard → Metrics tab
- **Uptime**: Use [UptimeRobot](https://uptimerobot.com/) (free)

### Scaling
- Free tier: 1 instance, 512MB RAM
- Upgrade: $7/month for 1GB RAM, always-on

---

For detailed deployment instructions, see `deployment_guide.md` artifact.
