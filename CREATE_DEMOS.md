# Creating Online Demos

## Method 1: StackBlitz (Recommended)

### Step 1: Create GitHub Repository

```bash
cd /Users/pwoods/Projects/portabletext-editor-bug-repro
git init
git add .
git commit -m "Initial commit: PortableText Editor 3.3.7 bug reproduction"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Open in StackBlitz

Once pushed to GitHub, you can open it directly in StackBlitz:

**For version 3.3.7 (broken):**
```
https://stackblitz.com/github/<your-username>/<repo-name>
```

**For version 3.3.6 (working):**
1. Open the 3.3.7 version first
2. Click "Fork" in StackBlitz
3. Edit `package.json` and change line:
   ```json
   "@portabletext/editor": "3.3.6"
   ```
4. StackBlitz will auto-install and restart
5. Save this fork with a new name like "portabletext-editor-3.3.6-working"

### Step 3: Share Links

You'll have two StackBlitz URLs:
- `https://stackblitz.com/edit/portabletext-bug-3-3-7` (broken)
- `https://stackblitz.com/edit/portabletext-bug-3-3-6` (working)

Include both links in your bug report!

---

## Method 2: CodeSandbox

### Option A: Import from GitHub

1. Go to https://codesandbox.io/dashboard
2. Click "Import" → "Import from GitHub"
3. Paste your repository URL
4. CodeSandbox will create a sandbox

### Option B: Manual Upload

1. Go to https://codesandbox.io/s/
2. Click "Create Sandbox"
3. Select "Vite React TypeScript" template
4. Replace all files with your files
5. Update `package.json` dependencies

### Creating Both Versions:

1. **First sandbox (3.3.7 - broken):**
   - Import/upload your code
   - Leave `package.json` as-is with version 3.3.7

2. **Second sandbox (3.3.6 - working):**
   - Fork the first sandbox
   - Edit `package.json`: change `"@portabletext/editor": "3.3.6"`
   - Dependencies will auto-install
   - Rename to "PortableText 3.3.6 (Working)"

---

## Method 3: Without GitHub (Quickest)

### Using StackBlitz WebContainer:

You can create a StackBlitz project directly without GitHub:

1. Go to https://stackblitz.com/
2. Choose "Vite + React + TypeScript"
3. Copy/paste each file's content
4. For the second version, fork and change the package.json

I can help you generate direct StackBlitz URLs!

---

## Automated: Create Both Versions as Separate Folders

Run this to create two separate folders:

```bash
cd /Users/pwoods/Projects
cp -r portabletext-editor-bug-repro portabletext-editor-bug-3.3.6
cp -r portabletext-editor-bug-repro portabletext-editor-bug-3.3.7

# Update version 3.3.6
cd portabletext-editor-bug-3.3.6
sed -i '' 's/"@portabletext\/editor": "3.3.7"/"@portabletext\/editor": "3.3.6"/' package.json

# Update version 3.3.7 (already correct)
cd ../portabletext-editor-bug-3.3.7

# Now you have two separate folders to upload
```

---

## What to Include in Bug Report

```markdown
## Live Demos

**Broken (v3.3.7):** https://stackblitz.com/edit/portabletext-bug-3-3-7
- Type `(NYSE:AAPL)` → Click "Transform Tickers" → ❌ No visual update

**Working (v3.3.6):** https://stackblitz.com/edit/portabletext-bug-3-3-6
- Type `(NYSE:AAPL)` → Click "Transform Tickers" → ✅ Immediate visual update

Comparing these two demos side-by-side clearly shows the regression introduced in 3.3.7.
```
