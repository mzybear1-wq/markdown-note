import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNoteStore } from '../store/useNoteStore';
import clsx from 'clsx';

export const Preview: React.FC = () => {
  const { getActiveNote } = useNoteStore();
  const activeNote = getActiveNote();

  if (!activeNote) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        Preview will appear here.
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto p-8 lg:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500">
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={vscDarkPlus}
                className="rounded-xl my-4 text-sm"
              />
            ) : (
              <code {...rest} className={clsx(className, "bg-gray-100 text-red-500 px-1.5 py-0.5 rounded-md font-mono text-sm")}>
                {children}
              </code>
            );
          },
        }}
      >
        {activeNote.content}
      </ReactMarkdown>
    </div>
  );
};
