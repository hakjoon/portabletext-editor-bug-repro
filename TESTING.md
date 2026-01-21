# Testing Instructions

## Quick Test

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

4. In the editor, type: `Check out (NYSE:AAPL) and (NASDAQ:GOOGL)`

5. Click "Transform Tickers"

6. **Bug observed**: The text `(NYSE:AAPL)` and `(NASDAQ:GOOGL)` remain as plain text
   - Check the debug JSON below - it shows the correct transformation
   - Reload the page - now the tickers render as styled inline objects

## Comparing Versions

### Quick Way: Use Git Branches

This repository has branches for both versions:

**Test with working version (3.3.6):**
```bash
git checkout working-3.3.6
npm install
npm run dev
```

Result: Clicking "Transform Tickers" immediately shows the styled ticker objects ✅

**Test with broken version (3.3.7):**
```bash
git checkout main
npm install
npm run dev
```

Result: Clicking "Transform Tickers" doesn't update the display ❌

### Alternative: Manual Version Installation

You can also test by manually changing versions:

**Test with 3.3.6 (working):**
```bash
npm install @portabletext/editor@3.3.6
npm run dev
```

Result: Works correctly ✅

**Test with 3.3.7 (broken):**
```bash
npm install @portabletext/editor@3.3.7
npm run dev
```

Result: Bug present ❌

**Test with latest version (3.3.16):**
```bash
npm install @portabletext/editor@3.3.16
npm run dev
```

Result: Still broken ❌

## What to Look For

### In Version 3.3.6 (Working):
1. Type ticker symbols in format `(EXCHANGE:SYMBOL)`
2. Click "Transform Tickers"
3. ✅ Immediately see styled ticker badges in blue background
4. ✅ Debug JSON shows transformed structure
5. ✅ Visual display matches the data

### In Version 3.3.7+ (Broken):
1. Type ticker symbols in format `(EXCHANGE:SYMBOL)`
2. Click "Transform Tickers"
3. ❌ Text remains unchanged visually
4. ✅ Debug JSON shows correct transformation (data is updated!)
5. ❌ Visual display does NOT match the data
6. ✅ After reload: styled tickers appear (proving data was saved correctly)

## Browser Console

Check the browser console after clicking "Transform Tickers":
- You'll see "Before transformation" and "After transformation" logs
- Compare the structures - note how `_type` changes from "span" to "inlineTicker"
- This structural change is not being detected by the editor's equality check in 3.3.7+

## Expected vs Actual

**Expected (3.3.6 behavior):**
```
Type: (NYSE:AAPL)
Click button → [NYSE:AAPL] (styled badge appears immediately)
```

**Actual (3.3.7+ behavior):**
```
Type: (NYSE:AAPL)
Click button → (NYSE:AAPL) (no visual change)
Debug JSON → Shows correct [inlineTicker] structure
Reload page → [NYSE:AAPL] (styled badge now appears)
```

## Key Observation

The data transformation is working correctly - the issue is purely with the editor's re-render detection. The custom equality function introduced in 3.3.7 (replacing lodash.isEqual) is not correctly identifying that the content has changed when:
- `_type` changes from "span" to "inlineTicker"
- New `_key` values are generated
- Child array structure is modified
