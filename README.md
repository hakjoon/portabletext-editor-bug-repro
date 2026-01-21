# PortableText Editor 3.3.7 Regression Bug Reproduction

This is a minimal reproduction of a regression bug introduced in `@portabletext/editor@3.3.7` where the editor fails to re-render when text spans are programmatically transformed into inline block objects.

## Bug Description

After upgrading from version 3.3.6 to 3.3.7, the Portable Text Editor no longer re-renders when text spans are transformed into inline objects via `PortableTextEditor.set()`. The content is correctly updated in the document state, but the visual representation doesn't update until the page is reloaded.

## Bisect Results

- ✅ **3.3.6** - Works correctly
- ❌ **3.3.7** - Bug first appears
- ❌ **3.3.8 - 3.3.16** - Bug persists

## Root Cause

Version 3.3.7 replaced `lodash.isEqual` with custom equality functions. The new equality checking incorrectly determines that content hasn't changed when:
- Text spans (`_type: "span"`) are transformed into inline objects (e.g., `_type: "inlineTicker"`)
- New `_key` values are generated
- Child array structures are modified

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

3. **Observe the bug:** The editor display doesn't update to show the inline ticker objects

4. **Check the debug output:** The JSON below the editor shows the transformed content is correct

5. **Verify it's saved:** Reload the page - the tickers now render correctly

## Expected Behavior

The editor should immediately re-render to display the newly created inline ticker objects after clicking "Transform Tickers".

## Actual Behavior

- The document state is correctly updated (visible in debug JSON)
- The editor display doesn't re-render
- After page reload, the inline objects render correctly
- The visual representation is out of sync with the actual document state

## Testing Different Versions

To test with version 3.3.6 (which works correctly):

```bash
npm install @portabletext/editor@3.3.6
npm run dev
```

To test with version 3.3.7+ (which has the bug):

```bash
npm install @portabletext/editor@3.3.7
npm run dev
```

## Related Links

- [GitHub Issue](https://github.com/portabletext/editor/issues)
- [Commit that introduced the bug](https://github.com/portabletext/editor/compare/@portabletext/editor@3.3.6...@portabletext/editor@3.3.7)
- Main change: "fix: remove lodash dependency"

## Technical Details

The transformation function (`transformTextToTickers`) in `src/App.tsx`:

1. Splits text by the ticker pattern `(EXCHANGE:SYMBOL)`
2. Creates new inline objects with `_type: "inlineTicker"`
3. Generates new `_key` values for all objects
4. Calls `PortableTextEditor.set(editor, transformed)`

In version 3.3.6, this correctly triggers a re-render. In 3.3.7+, the editor's new custom equality function fails to detect the change.

## License

MIT
