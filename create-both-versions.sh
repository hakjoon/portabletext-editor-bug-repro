#!/bin/bash

# Script to create two separate demo folders for version comparison

cd /Users/pwoods/Projects

echo "Creating version 3.3.6 (working)..."
cp -r portabletext-editor-bug-repro portabletext-editor-bug-3.3.6-working
cd portabletext-editor-bug-3.3.6-working
sed -i '' 's/"@portabletext\/editor": "3.3.7"/"@portabletext\/editor": "3.3.6"/' package.json
sed -i '' 's/3.3.7 Bug Reproduction/3.3.6 (WORKING VERSION)/' src/App.tsx
sed -i '' 's/<strong>Version Info:<\/strong> Works in 3.3.6, broken in 3.3.7+/<strong>Version Info:<\/strong> This is version 3.3.6 - the WORKING version/' src/App.tsx
echo "✅ Created: portabletext-editor-bug-3.3.6-working"

echo ""
echo "Creating version 3.3.7 (broken)..."
cd /Users/pwoods/Projects
cp -r portabletext-editor-bug-repro portabletext-editor-bug-3.3.7-broken
cd portabletext-editor-bug-3.3.7-broken
sed -i '' 's/3.3.7 Bug Reproduction/3.3.7 (BROKEN VERSION)/' src/App.tsx
sed -i '' 's/<strong>Version Info:<\/strong> Works in 3.3.6, broken in 3.3.7+/<strong>Version Info:<\/strong> This is version 3.3.7 - demonstrating the BUG/' src/App.tsx
echo "✅ Created: portabletext-editor-bug-3.3.7-broken"

echo ""
echo "=========================================="
echo "✅ Both versions created successfully!"
echo "=========================================="
echo ""
echo "Directories created:"
echo "  1. portabletext-editor-bug-3.3.6-working (the good one ✅)"
echo "  2. portabletext-editor-bug-3.3.7-broken (the broken one ❌)"
echo ""
echo "Next steps:"
echo "  1. Zip each folder: "
echo "     cd /Users/pwoods/Projects"
echo "     zip -r bug-3.3.6-working.zip portabletext-editor-bug-3.3.6-working"
echo "     zip -r bug-3.3.7-broken.zip portabletext-editor-bug-3.3.7-broken"
echo ""
echo "  2. Upload to StackBlitz:"
echo "     - Go to https://stackblitz.com/"
echo "     - Click 'Import project'"
echo "     - Upload each zip file"
echo ""
echo "  3. Or push to separate GitHub repos and use:"
echo "     https://stackblitz.com/github/<username>/<repo-3.3.6>"
echo "     https://stackblitz.com/github/<username>/<repo-3.3.7>"
echo ""
