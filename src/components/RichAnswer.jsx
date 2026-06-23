import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './RichAnswer.css';

let mermaidModule = null;

async function getMermaid() {
  if (!mermaidModule) {
    const m = await import('mermaid');
    mermaidModule = m.default;
    mermaidModule.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#f0ece3',
        primaryTextColor: '#111827',
        primaryBorderColor: '#ded3c1',
        lineColor: '#667085',
        secondaryColor: '#ede5d7',
        tertiaryColor: '#fffefa',
        noteBkgColor: '#f7f2e9',
        noteTextColor: '#374151',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px',
      },
    });
  }
  return mermaidModule;
}

let mermaidCounter = 0;

function MermaidDiagram({ code }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mmd-${++mermaidCounter}`;

    getMermaid()
      .then(mermaid => {
        if (cancelled) return null;
        return mermaid.render(id, code);
      })
      .then(result => {
        if (!cancelled && result && ref.current) {
          ref.current.innerHTML = result.svg;
        }
      })
      .catch(() => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre class="rich-answer__mermaid-fallback">${code}</pre>`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return <div className="rich-answer__mermaid" ref={ref} />;
}

const markdownComponents = {
  pre({ node, children }) {
    const lang = node?.children?.[0]?.properties?.className?.[0];
    if (lang === 'language-mermaid') {
      return <>{children}</>;
    }
    return <pre className="rich-answer__pre">{children}</pre>;
  },
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || '');
    if (match?.[1] === 'mermaid') {
      return <MermaidDiagram code={String(children).trim()} />;
    }
    return <code className={className}>{children}</code>;
  },
};

export default function RichAnswer({ content }) {
  if (!content?.trim()) return null;

  return (
    <div className="rich-answer">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
