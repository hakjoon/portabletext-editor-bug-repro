# Creating Demos from GitHub (Easiest Method)

Since you're already using Git, here's the simplest approach:

## Step 1: Create Two Branches

```bash
cd /Users/pwoods/Projects/portabletext-editor-bug-repro

# Main branch will be 3.3.7 (broken)
git checkout -b main
git add .
git commit -m "Demo: PortableText Editor 3.3.7 (broken)"

# Create branch for 3.3.6 (working)
git checkout -b working-3.3.6
# Edit package.json to change version to 3.3.6
sed -i '' 's/"@portabletext\/editor": "3.3.7"/"@portabletext\/editor": "3.3.6"/' package.json
# Update title
sed -i '' 's/3.3.7 Bug Reproduction/3.3.6 - WORKING VERSION/' src/App.tsx
git add .
git commit -m "Demo: PortableText Editor 3.3.6 (working)"

# Push both branches
git push origin main
git push origin working-3.3.6
```

## Step 2: Create StackBlitz Links

Once pushed to GitHub (e.g., `github.com/yourusername/portabletext-bug-repro`):

### Broken Version (3.3.7):
```
https://stackblitz.com/github/yourusername/portabletext-bug-repro/tree/main
```

### Working Version (3.3.6):
```
https://stackblitz.com/github/yourusername/portabletext-bug-repro/tree/working-3.3.6
```

## Step 3: Create CodeSandbox Links

### Broken Version (3.3.7):
```
https://codesandbox.io/s/github/yourusername/portabletext-bug-repro/tree/main
```

### Working Version (3.3.6):
```
https://codesandbox.io/s/github/yourusername/portabletext-bug-repro/tree/working-3.3.6
```

## Quick Commands (Copy-Paste Ready)

Replace `GITHUB_USERNAME` and `REPO_NAME` with your values:

```bash
# Set your GitHub details
GITHUB_USERNAME="your-username"
REPO_NAME="portabletext-bug-repro"

# Your demo URLs will be:
echo "Broken (3.3.7):"
echo "  StackBlitz: https://stackblitz.com/github/$GITHUB_USERNAME/$REPO_NAME/tree/main"
echo "  CodeSandbox: https://codesandbox.io/s/github/$GITHUB_USERNAME/$REPO_NAME/tree/main"
echo ""
echo "Working (3.3.6):"
echo "  StackBlitz: https://stackblitz.com/github/$GITHUB_USERNAME/$REPO_NAME/tree/working-3.3.6"
echo "  CodeSandbox: https://codesandbox.io/s/github/$GITHUB_USERNAME/$REPO_NAME/tree/working-3.3.6"
```

## For Your Bug Report

Include both links so maintainers can immediately see the difference:

```markdown
## Live Demos

**🐛 Broken (v3.3.7):**
- StackBlitz: https://stackblitz.com/github/yourusername/portabletext-bug-repro/tree/main
- CodeSandbox: https://codesandbox.io/s/github/yourusername/portabletext-bug-repro/tree/main

**✅ Working (v3.3.6):**
- StackBlitz: https://stackblitz.com/github/yourusername/portabletext-bug-repro/tree/working-3.3.6
- CodeSandbox: https://codesandbox.io/s/github/yourusername/portabletext-bug-repro/tree/working-3.3.6

### How to Test:
1. Open both demos side-by-side
2. In each demo, type: `Check out (NYSE:AAPL) stock`
3. Click "Transform Tickers" button
4. **v3.3.6**: Ticker immediately appears as styled badge ✅
5. **v3.3.7**: Text remains unchanged (check debug JSON - data IS updated!) ❌
```

## Advantages of This Approach

✅ Single repository, two branches
✅ Easy to maintain and update
✅ Automatic deployment to StackBlitz/CodeSandbox
✅ Side-by-side comparison for bug reporters
✅ No need to manually upload files

## Alternative: Single Branch with URL Parameter

If you prefer a single branch, you can use StackBlitz's URL parameters:

```
https://stackblitz.com/github/username/repo?file=package.json
```

Then users can manually change the version in package.json, but having two branches is clearer for bug reports.
