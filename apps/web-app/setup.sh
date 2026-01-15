#!/bin/bash
# TitanFit V2 - Quick Setup Script
# Run this script to setup the project automatically

set -e  # Exit on error

echo "🏋️ TitanFit V2 - Quick Setup"
echo "=============================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js 20+ required. You have $(node -v)"
    exit 1
fi
echo "✅ Node.js version OK: $(node -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment
echo "⚙️ Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
    echo "⚠️ IMPORTANT: Edit .env.local with your Supabase credentials!"
else
    echo "ℹ️ .env.local already exists, skipping..."
fi
echo ""

# Database setup instructions
echo "🗄️ Database Setup:"
echo "==================
1. Go to https://supabase.com and create a project
2. Copy your project URL and anon key to .env.local
3. In Supabase SQL Editor, run:
   - supabase/titan_cms_v2.sql (schema)
   - supabase/seed.sql (demo data)
4. Verify tables are created in Supabase Table Editor"
echo ""

# Start dev server
echo "🚀 Ready to start development!"
echo ""
read -p "Start dev server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting dev server..."
    npm run dev
else
    echo "Setup complete! Run 'npm run dev' when ready."
fi
