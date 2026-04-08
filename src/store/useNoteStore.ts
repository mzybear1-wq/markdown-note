import { create } from 'zustand';
import type { Note } from '../types';

const STORAGE_KEY = 'markdown_notes_data';

export interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  
  // Actions
  addNote: () => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Selectors
  getActiveNote: () => Note | undefined;
  getFilteredNotes: () => Note[];
}

const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
  }
  // Return a default initial note if empty
  return [
    {
      id: crypto.randomUUID(),
      title: 'Welcome to Markdown Notes!',
      content: '# Welcome to Markdown Notes!\n\nThis is a simple, elegant markdown editor.\n\n## Features:\n- 📝 **Live Preview**: See your formatting instantly.\n- 🎨 **Syntax Highlighting**: Beautiful code blocks.\n- 💾 **Auto Save**: Everything is saved to your browser automatically.\n- ⌨️ **Shortcuts**: Use `Tab` to indent and `Ctrl+B` to bold text.\n\nTry editing this note or creating a new one from the sidebar!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
};

const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
};

export const useNoteStore = create<NoteStore>((set, get) => {
  // Load initial notes
  const initialNotes = loadNotes();
  // Set the first note as active if available
  const initialActiveId = initialNotes.length > 0 ? initialNotes[0].id : null;

  return {
    notes: initialNotes,
    activeNoteId: initialActiveId,
    searchQuery: '',

    addNote: () => {
      set((state) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: 'Untitled Note',
          content: '# Untitled Note\n\nStart typing here...',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const newNotes = [newNote, ...state.notes];
        saveNotes(newNotes);
        return { notes: newNotes, activeNoteId: newNote.id };
      });
    },

    deleteNote: (id) => {
      set((state) => {
        const newNotes = state.notes.filter((n) => n.id !== id);
        saveNotes(newNotes);
        
        // If we deleted the active note, set a new active note or null
        let newActiveId = state.activeNoteId;
        if (state.activeNoteId === id) {
          newActiveId = newNotes.length > 0 ? newNotes[0].id : null;
        }
        
        return { notes: newNotes, activeNoteId: newActiveId };
      });
    },

    updateNote: (id, updates) => {
      set((state) => {
        const newNotes = state.notes.map((n) =>
          n.id === id
            ? { ...n, ...updates, updatedAt: new Date().toISOString() }
            : n
        );
        saveNotes(newNotes);
        return { notes: newNotes };
      });
    },

    setActiveNote: (id) => {
      set({ activeNoteId: id });
    },

    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },

    getActiveNote: () => {
      const { notes, activeNoteId } = get();
      return notes.find((n) => n.id === activeNoteId);
    },

    getFilteredNotes: () => {
      const { notes, searchQuery } = get();
      if (!searchQuery.trim()) return notes;
      
      const query = searchQuery.toLowerCase();
      return notes.filter((n) => n.title.toLowerCase().includes(query));
    },
  };
});
