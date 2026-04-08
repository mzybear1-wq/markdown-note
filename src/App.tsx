import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';

function App() {
  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor (Left Pane) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full shrink-0">
          <Editor />
        </div>
        
        {/* Preview (Right Pane) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
          <Preview />
        </div>
      </main>
    </div>
  );
}

export default App;
