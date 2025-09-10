import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  // Only handle incomplete code blocks during streaming
  const cleanContent = React.useMemo(() => {
    if (!children) return "";
    let content = children;
    // Handle incomplete code blocks during streaming
    const codeBlockMatches = content.match(/```/g);
    if (codeBlockMatches && codeBlockMatches.length % 2 === 1) {
      content += '\n```';
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
        <ol className="list-decimal list-outside ml-4 my-2 space-y-1" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-0.5 leading-relaxed" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-outside ml-4 my-2 space-y-1" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100" {...props}>
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
        <div className="overflow-x-auto my-6 not-prose">
          <table className="min-w-full border-collapse bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700" {...props}>
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
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700" {...props}>
          {children}
        </tbody>
      );
    },
    tr: ({ node, children, ...props }: any) => {
      return (
        <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" {...props}>
          {children}
        </tr>
      );
    },
    td: ({ node, children, ...props }: any) => {
      return (
        <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0 align-top" {...props}>
          <div className="max-w-sm break-words">
            {children}
          </div>
        </td>
      );
    },
    th: ({ node, children, ...props }: any) => {
      return (
        <th className="px-4 py-3 text-sm font-semibold text-left text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700 border-r border-zinc-200 dark:border-zinc-600 last:border-r-0" {...props}>
          {children}
        </th>
      );
    },
    p: ({ node, children, ...props }: any) => {
      return (
        <p className="mb-2 leading-relaxed text-zinc-800 dark:text-zinc-200" {...props}>
          {children}
        </p>
      );
    },
    br: ({ node, ...props }: any) => {
      return <br {...props} />;
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-2xl font-bold mb-3 mt-6 text-zinc-900 dark:text-zinc-100" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-xl font-bold mb-2 mt-5 text-zinc-900 dark:text-zinc-100" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      const text = typeof children === 'string' ? children : '';
      const isMetrics = text.includes('📊') || text.includes('Response Quality Metrics');
      
      return (
        <h3 className={`text-lg font-bold mb-2 mt-4 ${isMetrics ? 'text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-1' : 'text-zinc-900 dark:text-zinc-100'}`} {...props}>
          {children}
        </h3>
      );
    },
    blockquote: ({ node, children, ...props }: any) => {
      return (
        <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-3 text-zinc-700 dark:text-zinc-300" {...props}>
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
        remarkPlugins={[remarkGfm, remarkBreaks]} 
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
