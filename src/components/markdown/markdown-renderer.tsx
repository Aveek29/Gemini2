"use client";

import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const lineCount = children.split("\n").length;

  const handleCopy = useCallback(async () => {
    await copyToClipboard(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="relative group my-4 rounded-xl border border-white/[0.08] bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.08]">
        <span className="text-xs text-white/40 font-mono">{language || "code"}</span>
        <div className="flex items-center gap-2">
          {lineCount > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? "Collapse" : "Expand"}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className={cn("overflow-auto", !expanded && "max-h-40")}>
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          showLineNumbers={lineCount > 3}
          lineNumberStyle={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      {!expanded && lineCount > 5 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-xs text-[#8ab4f8] hover:text-[#aecbfa] border-t border-[#3c4043] bg-[#282a2a] transition-colors"
        >
          Show all {lineCount} lines
        </button>
      )}
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-dark">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            if (match) {
              return <CodeBlock language={match[1]} children={codeString} />;
            }
            return (
              <code className="bg-[#282a2a] px-1.5 py-0.5 rounded-md text-sm font-mono text-[#aecbfa]" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08]">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-white/[0.05]">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-2 text-left font-semibold text-white border-b border-white/[0.08]">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2 border-b border-white/[0.05]">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-3 border-[#1a73e8] pl-4 my-4 text-[#9aa0a6] italic">
                {children}
              </blockquote>
            );
          },
          a({ children, href }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8ab4f8] hover:text-[#aecbfa] underline underline-offset-4 transition-colors">
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-6 border-white/[0.1]" />;
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 space-y-1">{children}</ol>;
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h3>;
          },
          li({ children }) {
            return <li className="text-white/80">{children}</li>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
