#!/bin/bash

# 🚀 Eventify Platform - Quick GitHub Deploy
echo "🎯 Event & Concert Booking Platform - GitHub Setup"
echo "================================================"

# Initialize Git repository
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "📁 Adding files..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "🎉 Initial commit - Event & Concert Booking Platform"

# Get GitHub URL
echo ""
echo "🔗 Enter your GitHub repository URL:"
echo "   Example: https://github.com/username/repository.git"
read -p "   Your URL: " REPO_URL

# Add remote and push
echo "🚀 Deploying to GitHub..."
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo "✅ Success! Your project is now on GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to your repository on GitHub"
echo "2. Click Settings → Pages"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/(root)' folder"
echo "5. Click Save"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://yourusername.github.io/repository-name"
