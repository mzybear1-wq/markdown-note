import React from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { FileText, Plus, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const {
    activeNoteId,
    searchQuery,
    addNote,
    deleteNote,
    setActiveNote,
    setSearchQuery,
    getFilteredNotes,
  } = useNoteStore();

  const filteredNotes = getFilteredNotes();

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-[40vh] md:h-screen shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Notes
          </h1>
          <button
            onClick={addNote}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="New Note"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Click the + button to create one!'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => setActiveNote(note.id)}
                  className={clsx(
                    'w-full text-left p-4 hover:bg-gray-100 transition-colors group relative',
                    activeNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                  )}
                >
                  <div className="pr-6">
                    <h3 className="font-medium text-gray-900 truncate">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  
                  {/* Delete Button (visible on hover) */}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                  >
                    <div className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 size={16} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
