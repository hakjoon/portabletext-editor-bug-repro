import { useState } from 'react'
import { PortableTextEditor, usePortableTextEditor } from '@portabletext/editor'
import type { PortableTextBlock } from '@sanity/types'
import { schema } from './schema'

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

      parts.forEach((part, index) => {
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
      _key: randomKey(),
      children: newChildren,
    }
  })
}

function EditorComponent() {
  const editor = usePortableTextEditor()
  const [value, setValue] = useState<PortableTextBlock[]>([
    {
      _type: 'block',
      _key: 'block1',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Type a stock ticker like (NYSE:AAPL) or (NASDAQ:GOOGL) and click the button.',
          marks: [],
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ])

  const handleTransform = () => {
    const currentValue = PortableTextEditor.getValue(editor)
    const transformed = transformTextToTickers(currentValue)

    console.log('Before transformation:', JSON.stringify(currentValue, null, 2))
    console.log('After transformation:', JSON.stringify(transformed, null, 2))

    PortableTextEditor.set(editor, transformed)
    setValue(transformed)
  }

  return (
    <div className="container">
      <h1>PortableText Editor 3.3.7 Bug Reproduction</h1>

      <div className="instructions">
        <h3>Steps to Reproduce:</h3>
        <ol>
          <li>Type text with ticker symbols in format: <code>(EXCHANGE:SYMBOL)</code></li>
          <li>Example: <code>(NYSE:AAPL)</code> or <code>(NASDAQ:GOOGL)</code></li>
          <li>Click "Transform Tickers" button</li>
          <li><strong>Bug:</strong> The editor doesn't re-render to show the inline ticker objects</li>
          <li><strong>Expected:</strong> Tickers should immediately appear as styled inline objects</li>
          <li><strong>Workaround:</strong> Reload the page to see the tickers rendered</li>
        </ol>
        <p><strong>Version Info:</strong> Works in 3.3.6, broken in 3.3.7+</p>
      </div>

      <button onClick={handleTransform}>
        Transform Tickers
      </button>

      <div className="editor-wrapper">
        <PortableTextEditor
          onChange={(change) => {
            setValue(change)
          }}
          value={value}
          schemaType={schema}
          renderChild={(props) => {
            if (props.value._type === 'inlineTicker') {
              return (
                <span className="inline-ticker">
                  {props.value.symbol}
                </span>
              )
            }
            return props.children
          }}
        />
      </div>

      <div className="debug">
        <h3>Current Editor Value (Debug):</h3>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  )
}

export default function App() {
  return <EditorComponent />
}
