"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { copypasta } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";

export function MarkdownContent({ children }: { children: React.ReactNode }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <Pre style={{ marginTop: 0, marginBottom: "1rem" }} {...props}>
              <ReactSyntaxHighlighter
                language={match[1]}
                style={copypasta}
                PreTag="div"
                showLineNumbers={false}
                customStyle={{
                  marginTop: 0,
                  marginBottom: 0,
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  overflow: "auto",
                  background: "#0f172a",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </ReactSyntaxHighlighter>
            </Pre>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
