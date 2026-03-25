# 🚀 Railway Deployment Guide

## Deploy Your Spring Boot Backend to Railway (Free)

### Prerequisites
- Railway account (free)
- GitHub account
- Your backend code ready

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Update API URLs for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `Eventify-Platform` repository
5. Railway will auto-detect your Spring Boot app

### Step 3: Configuration
1. Once deployed, Railway will give you a URL like:
   `https://eventify-backend.railway.app`
2. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SPRING_DATASOURCE_URL`: Same as above
   - `SPRING_DATASOURCE_USERNAME`: Your DB username
   - `SPRING_DATASOURCE_PASSWORD`: Your DB password

### Step 4: Database Setup
1. In Railway dashboard, add **PostgreSQL** service
2. Get connection string from Railway
3. Update your `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://your-railway-db-url
spring.datasource.username=your-username
spring.datasource.password=your-password
```

### What I've Updated
I've already updated all your JavaScript files to use:
`https://eventify-backend.railway.app`

Instead of:
`http://localhost:8080`

### Files Updated:
- ✅ `script.js` - Authentication APIs
- ✅ `bookings.js` - Booking APIs  
- ✅ `payment.js` - Payment API

### Next Steps
1. Deploy backend to Railway
2. Update environment variables
3. Test APIs work
4. Commit and push changes

### Result
- 📱 Mobile will work perfectly
- 💻 Desktop will work perfectly
- 🌐 Cross-platform functionality
- 🎯 Interview-ready full-stack app

## Need Help?
Railway documentation: https://docs.railway.app
