import { useState, useEffect } from 'react'
import { PortableTextEditor, PortableTextEditable, usePortableTextEditor } from '@portabletext/editor'
import type { PortableTextBlock } from '@sanity/types'
import { schema } from './schema'

// Get the installed version
// @ts-ignore
import editorPackage from '@portabletext/editor/package.json'
const EDITOR_VERSION = editorPackage.version

const STORAGE_KEY = 'portabletext-bug-repro-value'

const getInitialValue = (): PortableTextBlock[] => {
  // Try to load from localStorage first
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse stored value:', e)
    }
  }

  // Default initial value
  return [
    {
      _type: 'block',
      _key: 'block1',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Line with ticker at end: (NYSE:AAPL)',
          marks: [],
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _type: 'block',
      _key: 'block2',
      children: [
        {
          _type: 'span',
          _key: 'span2',
          text: 'Another ticker at end: (NASDAQ:GOOGL)',
          marks: [],
        },
      ],
      markDefs: [],
      style: 'normal',
    },
    {
      _type: 'block',
      _key: 'block3',
      children: [
        {
          _type: 'span',
          _key: 'span3',
          text: 'Ticker in middle (NYSE:TSLA) with text after it.',
          marks: [],
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ]
}

// Regex to match ticker format: (EXCHANGE:SYMBOL)
const TICKER_REGEX = /\(([A-Z]+:[A-Z]+)\)/g

function randomKey() {
  return Math.random().toString(36).substring(2, 15)
}

function transformTextToTickers(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) {
      return block
    }

    const newChildren = block.children.flatMap((child: any) => {
      if (child._type !== 'span' || typeof child.text !== 'string') {
        return [child]
      }

      // Split text by ticker pattern
      const parts = child.text.split(TICKER_REGEX)
      const result: any[] = []

      parts.forEach((part: string, index: number) => {
        if (index % 2 === 0) {
          // Regular text
          if (part.length > 0) {
            result.push({
              ...child,
              _key: randomKey(),
              text: part,
            })
          }
        } else {
          // This is a ticker (captured group)
          result.push({
            _type: 'inlineTicker',
            _key: randomKey(),
            symbol: part,
          })
        }
      })

      return result.length > 0 ? result : [child]
    })

    return {
      ...block,
      children: newChildren,
    }
  })
}

// Custom renderer for inline ticker objects
const renderChild = (props: any) => {
  if (props.value._type === 'inlineTicker') {
    return (
      <span className="inline-ticker" {...props.attributes}>
        {props.value.symbol}
      </span>
    )
  }
  return props.children
}

// Transform button that uses the editor directly
function TransformButton({ onTransform }: { onTransform: (editorValue: PortableTextBlock[]) => void }) {
  const editor = usePortableTextEditor()

  const handleClick = () => {
    const currentValue = PortableTextEditor.getValue(editor)
    if (!currentValue) return

    onTransform(currentValue)
  }

  return (
    <button onClick={handleClick}>
      Transform Tickers
    </button>
  )
}

function EditorComponent() {
  const [value, setValue] = useState<PortableTextBlock[]>(getInitialValue)

  // Save to localStorage whenever value changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, [value])

  const handleTransform = (editorValue: PortableTextBlock[]) => {
    const transformed = transformTextToTickers(editorValue)

    console.log('Before transformation:', JSON.stringify(editorValue, null, 2))
    console.log('After transformation:', JSON.stringify(transformed, null, 2))

    // This updates the value prop passed to PortableTextEditor
    // In 3.3.6, the editor detects this change and re-renders
    // In 3.3.7+, the editor's equality check fails to detect the change
    setValue(transformed)
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  return (
    <div className="container">
      <h1>PortableText Editor Bug Reproduction</h1>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '-10px' }}>
        Running @portabletext/editor <strong>v{EDITOR_VERSION}</strong>
      </p>

      <div className="instructions">
        <h3>Steps to Reproduce:</h3>
        <ol>
          <li>Notice the editor has 3 lines with tickers (some at end, one in middle of text)</li>
          <li>Click "Transform Tickers" button</li>
          <li><strong>Bug:</strong> All text disappears completely from the editor</li>
          <li><strong>Note:</strong> On the third line, even the text "with text after it." vanishes</li>
          <li><strong>Check console:</strong> The data IS correctly transformed (see logs)</li>
          <li><strong>Check debug JSON below:</strong> Shows the correct structure with inline tickers</li>
          <li><strong>Reload the page:</strong> The tickers now render correctly as styled badges!</li>
          <li><strong>Click "Reset Demo"</strong> to start over with fresh data</li>
        </ol>
        <p><strong>The Problem:</strong> The React state (shown in debug JSON) has the correct data with inline ticker objects, but the editor display is completely blank. The editor failed to detect the value change and didn't re-render. After reloading, the data loads from localStorage and renders correctly.</p>
        <p><strong>Version Behavior:</strong></p>
        <ul>
          <li>✅ <strong>3.3.6:</strong> Works correctly - tickers appear immediately</li>
          <li>❌ <strong>3.3.7+:</strong> Bug present - text disappears</li>
          <li>💡 <strong>Test it:</strong> Run <code>npm install @portabletext/editor@3.3.6</code> to see it work!</li>
        </ul>
        <p><strong>In Sanity Studio:</strong> This exact bug causes text to vanish when transforming tickers. Reloading shows the correctly transformed tickers - proving the data was saved but the editor just didn't re-render.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={handleReset} style={{ background: '#666', color: 'white' }}>
          Reset Demo
        </button>
      </div>

      <div className="editor-wrapper">
        <PortableTextEditor
          onChange={(change: any) => {
            // Handle different change formats
            if (Array.isArray(change)) {
              setValue(change)
            } else if (change?.value && Array.isArray(change.value)) {
              setValue(change.value)
            }
          }}
          value={value}
          schemaType={schema as any}
        >
          <TransformButton onTransform={handleTransform} />
          <PortableTextEditable
            renderChild={renderChild}
          />
        </PortableTextEditor>
      </div>

      <div className="debug">
        <h3>Current Editor Value (Debug):</h3>
        <p><small>⬇️ This shows the data IS updated correctly, even though the editor display doesn't change</small></p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  )
}

export default function App() {
  return <EditorComponent />
}
