# Quick Start Guide

## 🚀 Fastest Way to Create Online Demos

### 1. Run the setup script

```bash
cd /Users/pwoods/Projects/portabletext-editor-bug-repro
./setup-demo-branches.sh
```

This creates two branches:
- `main` - version 3.3.7 (broken) ❌
- `working-3.3.6` - version 3.3.6 (working) ✅

### 2. Push to GitHub

```bash
# Create a new repo at: https://github.com/new
# Then:

git remote add origin git@github.com:YOUR_USERNAME/portabletext-bug-repro.git
git push -u origin main
git push -u origin working-3.3.6
```

### 3. Get Your Demo URLs

Replace `YOUR_USERNAME` with your GitHub username:

**StackBlitz (recommended):**
- Broken: `https://stackblitz.com/github/YOUR_USERNAME/portabletext-bug-repro/tree/main`
- Working: `https://stackblitz.com/github/YOUR_USERNAME/portabletext-bug-repro/tree/working-3.3.6`

**CodeSandbox:**
- Broken: `https://codesandbox.io/s/github/YOUR_USERNAME/portabletext-bug-repro/tree/main`
- Working: `https://codesandbox.io/s/github/YOUR_USERNAME/portabletext-bug-repro/tree/working-3.3.6`

### 4. Test Your Demos

1. Open both URLs side-by-side
2. Type: `Check out (NYSE:AAPL) and (NASDAQ:GOOGL)`
3. Click "Transform Tickers"
4. Compare:
   - ✅ 3.3.6: Tickers appear immediately as styled badges
   - ❌ 3.3.7: Text doesn't change (but check JSON - it's updated!)

### 5. Include in Bug Report

```markdown
## Live Demos

**🐛 Broken (v3.3.7):**
https://stackblitz.com/github/YOUR_USERNAME/portabletext-bug-repro/tree/main

**✅ Working (v3.3.6):**
https://stackblitz.com/github/YOUR_USERNAME/portabletext-bug-repro/tree/working-3.3.6
```

---

## Done! 🎉

You now have:
- ✅ Two online demos (broken vs working)
- ✅ Easy to share links
- ✅ No manual file uploads needed
- ✅ Automatic updates if you push changes

Perfect for bug reports to show the exact regression!
