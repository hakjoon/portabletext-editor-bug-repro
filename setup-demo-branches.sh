#!/bin/bash

# Helper script to set up demo branches for GitHub → StackBlitz/CodeSandbox

set -e  # Exit on error

echo "================================================"
echo "Setting up demo branches for bug reproduction"
echo "================================================"
echo ""

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Initialize git if not already
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Create and commit main branch (3.3.7 - broken)
echo "📦 Setting up main branch (3.3.7 - broken)..."
git checkout -b main 2>/dev/null || git checkout main
git add .
git commit -m "Demo: PortableText Editor 3.3.7 (broken)" 2>/dev/null || echo "  (already committed)"

# Create working-3.3.6 branch
echo ""
echo "📦 Setting up working-3.3.6 branch..."
git checkout -b working-3.3.6 2>/dev/null || git checkout working-3.3.6

# Update to version 3.3.6
echo "  - Updating package.json to 3.3.6..."
sed -i '' 's/"@portabletext\/editor": "3.3.7"/"@portabletext\/editor": "3.3.6"/' package.json

# Update title in App.tsx
echo "  - Updating App.tsx title..."
sed -i '' 's/PortableText Editor 3.3.7 Bug Reproduction/PortableText Editor 3.3.6 - WORKING VERSION/' src/App.tsx
sed -i '' 's/<strong>Version Info:<\/strong> Works in 3.3.6, broken in 3.3.7+/<strong>Version Info:<\/strong> This is version 3.3.6 - the WORKING version/' src/App.tsx

git add package.json src/App.tsx
git commit -m "Demo: PortableText Editor 3.3.6 (working)" 2>/dev/null || echo "  (already committed)"

# Switch back to main
git checkout main

echo ""
echo "================================================"
echo "✅ Branches created successfully!"
echo "================================================"
echo ""
echo "Branches:"
echo "  • main (3.3.7 - broken) ❌"
echo "  • working-3.3.6 (3.3.6 - working) ✅"
echo ""
echo "Next steps:"
echo ""
echo "1. Create a GitHub repository at: https://github.com/new"
echo ""
echo "2. Push both branches:"
echo "   git remote add origin git@github.com:USERNAME/REPO.git"
echo "   git push -u origin main"
echo "   git push -u origin working-3.3.6"
echo ""
echo "3. Your StackBlitz demo URLs will be:"
echo "   Broken:  https://stackblitz.com/github/USERNAME/REPO/tree/main"
echo "   Working: https://stackblitz.com/github/USERNAME/REPO/tree/working-3.3.6"
echo ""
echo "4. Your CodeSandbox demo URLs will be:"
echo "   Broken:  https://codesandbox.io/s/github/USERNAME/REPO/tree/main"
echo "   Working: https://codesandbox.io/s/github/USERNAME/REPO/tree/working-3.3.6"
echo ""
echo "Replace USERNAME and REPO with your GitHub username and repo name."
echo ""
