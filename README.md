# PortableText Editor 3.3.7 Regression Bug Reproduction

This is a minimal reproduction of a regression bug introduced in `@portabletext/editor@3.3.7` where the editor fails to re-render when text spans are programmatically transformed into inline block objects.

## Bug Description

After upgrading from version 3.3.6 to 3.3.7, the Portable Text Editor no longer re-renders when text spans are transformed into inline objects. The content is correctly updated in the document state (as shown in console logs and debug output), but the visual representation doesn't update until the page is reloaded.

## Bisect Results

- ✅ **3.3.6** - Works correctly
- ❌ **3.3.7** - Bug first appears
- ❌ **3.3.8 - 3.3.16** - Bug persists

## Root Cause

Version 3.3.7 replaced `lodash.isEqual` with custom equality functions. The new equality checking (`isEqualValues`) incorrectly determines that content hasn't changed when:
- Text spans (`_type: "span"`) are transformed into inline objects (e.g., `_type: "inlineTicker"`)
- New `_key` values are generated for child elements
- Child array structures are modified

This causes the editor to skip re-rendering even though the data structure has fundamentally changed.

## Installation

```bash
npm install
```

## Running the Reproduction

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## Steps to Reproduce

1. Type text containing ticker symbols in the format `(EXCHANGE:SYMBOL)`
   - Example: `(NYSE:AAPL)` or `(NASDAQ:GOOGL)`

2. Click the "Transform Tickers" button

3. **Observe the bug:** The text disappears completely from the editor

4. **Check the console:** The transformation logs show the data was correctly updated

5. **Check the debug JSON:** Below the editor, the JSON shows the correct structure with `inlineTicker` objects

6. **Reload the page:** The tickers now render correctly as styled badges

## Expected Behavior

The editor should immediately re-render to display the newly created inline ticker objects after clicking "Transform Tickers". The text `(NYSE:AAPL)` should instantly become a styled ticker badge.

## Actual Behavior in 3.3.7+

- When "Transform Tickers" is clicked, the text **disappears completely** from the editor
- The console logs show the data is correctly transformed
- The debug JSON shows the correct structure with `inlineTicker` objects
- The editor display is out of sync with the actual document state
- After page reload, the inline objects render correctly

This happens because the editor's new `isEqualValues` function fails to detect that the value has changed, so it doesn't trigger a re-render.

## Testing Different Versions

This repository includes a `working-3.3.6` branch for easy comparison:

**Quick test (switch branches):**
```bash
git checkout working-3.3.6  # Working version ✅
git checkout main           # Broken version ❌
```

**Side-by-side comparison (recommended):**
```bash
# Run both versions simultaneously using git worktrees
git worktree add ../portabletext-editor-bug-repro-working working-3.3.6

# Terminal 1: main branch on http://localhost:5173
npm run dev

# Terminal 2: working-3.3.6 branch on http://localhost:5174
cd ../portabletext-editor-bug-repro-working
npm install && npm run dev -- --port 5174
```

See [TESTING.md](TESTING.md) for detailed testing instructions, expected behaviors, and more testing approaches.

## Technical Details

The transformation function (`transformTextToTickers`) in [src/App.tsx](src/App.tsx):

1. Splits text by the ticker pattern `(EXCHANGE:SYMBOL)` using regex
2. Creates new inline objects with `_type: "inlineTicker"`
3. Generates new `_key` values for all child objects
4. Updates the value via `setValue(transformed)`

The updated value is passed to the `PortableTextEditor` component via the `value` prop. In version 3.3.6, the editor detects this change and re-renders. In 3.3.7+, the editor's new custom equality function (`isEqualValues`) incorrectly determines the values are equal and skips the re-render.

### What Changed in 3.3.7

The key change was replacing `lodash.isEqual` with custom equality functions:
- `isEqualValues` - compares arrays of blocks
- `isEqualBlocks` - compares individual blocks
- `isEqualTextBlocks` - compares text blocks
- `isEqualChildren` - compares child arrays
- `isEqualSpans` - compares span objects
- `isEqualInlineObjects` - compares inline objects

The bug occurs because these functions don't properly detect when a child's `_type` changes from `"span"` to a different inline object type.

## Related Links

- [GitHub Issues for @portabletext/editor](https://github.com/portabletext/editor/issues)
- [Commit that introduced the bug](https://github.com/portabletext/editor/compare/@portabletext/editor@3.3.6...@portabletext/editor@3.3.7)
- Main change: "fix: remove lodash dependency"

## License

MIT
