import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  // Clean up the content to handle streaming issues
  const cleanContent = React.useMemo(() => {
    if (!children) return "";
    
    // Handle incomplete markdown during streaming
    let content = children;
    
    // If content ends with incomplete table rows, try to clean it up
    if (content.includes('|') && !content.endsWith('\n')) {
      const lines = content.split('\n');
      const lastLine = lines[lines.length - 1];
      
      // If last line looks like an incomplete table row, remove it temporarily
      if (lastLine.includes('|') && !lastLine.trim().endsWith('|')) {
        content = lines.slice(0, -1).join('\n');
      }
    }
    
    return content;
  }, [children]);

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    table: ({ node, children, ...props }: any) => {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900" {...props}>
            {children}
          </table>
        </div>
      );
    },
    thead: ({ node, children, ...props }: any) => {
      return (
        <thead className="bg-zinc-50 dark:bg-zinc-800" {...props}>
          {children}
        </thead>
      );
    },
    tbody: ({ node, children, ...props }: any) => {
      return (
        <tbody {...props}>
          {children}
        </tbody>
      );
    },
    tr: ({ node, children, ...props }: any) => {
      return (
        <tr className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50" {...props}>
          {children}
        </tr>
      );
    },
    td: ({ node, children, ...props }: any) => {
      return (
        <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm align-top" {...props}>
          {children}
        </td>
      );
    },
    th: ({ node, children, ...props }: any) => {
      return (
        <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm font-semibold text-left bg-zinc-100 dark:bg-zinc-700" {...props}>
          {children}
        </th>
      );
    },
    p: ({ node, children, ...props }: any) => {
      return (
        <p className="mb-2 leading-relaxed" {...props}>
          {children}
        </p>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-2xl font-bold mb-4 mt-6" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-xl font-bold mb-3 mt-5" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-lg font-bold mb-2 mt-4" {...props}>
          {children}
        </h3>
      );
    },
    blockquote: ({ node, children, ...props }: any) => {
      return (
        <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-4" {...props}>
          {children}
        </blockquote>
      );
    },
    em: ({ node, children, ...props }: any) => {
      return (
        <em className="italic" {...props}>
          {children}
        </em>
      );
    },
    del: ({ node, children, ...props }: any) => {
      return (
        <del className="line-through" {...props}>
          {children}
        </del>
      );
    },
    hr: ({ node, ...props }: any) => {
      return (
        <hr className="my-4 border-zinc-300 dark:border-zinc-600" {...props} />
      );
    },
  };

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components}
        skipHtml={false}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
