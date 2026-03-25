#!/bin/bash

# 🚀 Eventify Platform - GitHub Setup Script
# This script helps you deploy your project to GitHub Pages

echo "🎯 Event & Concert Booking Platform - GitHub Setup"
echo "================================================"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized!"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit - Event & Concert Booking Platform

✨ Features:
- User authentication system
- Event browsing and booking
- Payment integration
- My bookings management
- QR code ticket generation
- Responsive design
- Support system

🛠 Tech Stack:
- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: Java 17, Spring Boot, PostgreSQL
- Deployment: GitHub Pages ready"

# Get repository URL
echo ""
echo "🔗 Please enter your GitHub repository URL:"
echo "   Format: https://github.com/yourusername/your-repo-name.git"
read -p "   Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No repository URL provided. Exiting."
    exit 1
fi

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin "$REPO_URL"
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to your repository on GitHub"
echo "2. Click Settings tab"
echo "3. Scroll to Pages section"
echo "4. Select source as 'Deploy from a branch'"
echo "5. Choose 'main' branch and '/(root)' folder"
echo "6. Click Save"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://$(echo $REPO_URL | sed 's|https://github.com/||' | sed 's|\.git||')"
echo ""
echo "🎯 Your Event & Concert Booking Platform is ready for interviews!"
