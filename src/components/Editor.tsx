import React, { useRef } from 'react';
import { useNoteStore } from '../store/useNoteStore';

export const Editor: React.FC = () => {
  const { getActiveNote, updateNote } = useNoteStore();
  const activeNote = getActiveNote();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!activeNote) {
    return (
      <div className="flex items-center justify-center h-full bg-white text-gray-500 border-r border-gray-200">
        Select a note or create a new one to start editing.
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(activeNote.id, { content: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(activeNote.id, { title: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!textareaRef.current) return;

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      const newContent =
        activeNote.content.substring(0, start) +
        '  ' +
        activeNote.content.substring(end);
      
      updateNote(activeNote.id, { content: newContent });
      
      // Reset cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    // Handle Ctrl+B / Cmd+B for Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      const selectedText = activeNote.content.substring(start, end);
      const newContent =
        activeNote.content.substring(0, start) +
        `**${selectedText}**` +
        activeNote.content.substring(end);
        
      updateNote(activeNote.id, { content: newContent });
      
      // Reset cursor position inside the asterisks if text was selected, or between them if empty
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2 + selectedText.length;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 shrink-0">
        <input
          type="text"
          value={activeNote.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full text-2xl font-bold text-gray-800 border-none focus:outline-none focus:ring-0 placeholder-gray-400 bg-transparent"
        />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <textarea
          ref={textareaRef}
          value={activeNote.content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing your markdown here..."
          className="w-full h-full min-h-[500px] resize-none border-none focus:outline-none focus:ring-0 text-gray-700 font-mono text-[15px] leading-relaxed bg-transparent"
        />
      </div>
    </div>
  );
};
