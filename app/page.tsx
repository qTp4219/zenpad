'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Plus, Trash2, Search, Edit3, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { type Note } from '@/types';

// Dynamically import MarkdownEditor to avoid SSR issues with browser APIs
const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), { ssr: false });

const WELCOME_NOTE_CONTENT = `# Welcome to ZenPad \ud83c\udf43\n\nThis is a comprehensive Markdown showcase to test rendering.\n\n## Headings\n\n# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n\n## Text Formatting\n\nThis is **bold text**, this is *italic text*, and this is ~~strikethrough~~.\nCombine them: ***bold and italic***.\n\n## Lists\n\n### Unordered List\n* Apple\n* Banana\n  * Cavendish\n  * Plantain\n* Cherry\n\n### Ordered List\n1. First item\n2. Second item\n   1. Sub-item A\n   2. Sub-item B\n3. Third item\n\n## Blockquotes\n\n> "Simplicity is the ultimate sophistication."\n> \u2014 Leonardo da Vinci\n\n> Nested blockquotes\n>> Like this one\n\n## Links and Images\n\n[Google AI Studio](https://ai.studio)\n\n![Placeholder Image](https://picsum.photos/seed/picsum/600/300)\n\n## Code\n\nInline code: \`const message = "Hello World";\`\n\nBlock code:\n\n\`\`\`typescript\nfunction greet(name: string): string {\n  return \\\`Hello, \\\${name}!\\\`;\n}\n\`\`\`\n\n## Thematic Break (Horizontal Rule)\n\n---\n\n## Task Lists (if supported)\n\n- [x] Create welcome page\n- [ ] Review markdown rendering\n- [ ] Add Custom CSS for rendering\n\n## Tables (if supported)\n\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |\n`;

export default function ZenPad() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlainTextMode, setIsPlainTextMode] = useState(false);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('zenpad_notes_v2');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotes(parsed);
        if (parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setActiveNoteId(parsed[0].id);
        }
      } catch (e) {
        console.error('Error parsing notes from local storage', e);
      }
    } else {
      // Default note
      const defaultNote: Note = {
        id: uuidv4(),
        title: 'Welcome to ZenPad \ud83c\udf43',
        content: WELCOME_NOTE_CONTENT,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes([defaultNote]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveNoteId(defaultNote.id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('zenpad_notes_v2', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt);

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\n',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setSearchQuery('');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.find((n) => n.id !== id)?.id || null);
    }
  };

  const updateActiveNoteContent = (newContent: string) => {
    if (!activeNoteId) return;

    // Extract title from the first line (if heading) or first chars
    const lines = newContent.split('\n');
    let title = 'Untitled Note';
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^#+\s/, '').trim();
      if (firstLine) {
         // Limit title length
         title = firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
      } else if (newContent.trim().length > 0) {
         const preview = newContent.trim().substring(0, 40);
         title = preview + '...';
      }
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? { ...n, content: newContent, title, updatedAt: Date.now() }
          : n
      )
    );
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-[#9da5b4]">Loading ZenPad...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1115] text-[#9da5b4]">
      {/* Sidebar - Sublime Text File Explorer Aesthetic */}
      {isSidebarOpen && (
        <div className="w-64 md:w-80 bg-[#181a1f] border-r border-[#000000] flex flex-col flex-shrink-0 relative z-10 transition-all shadow-xl shadow-black/20">
          
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b border-[#000000] bg-[#181a1f]/90 backdrop-blur-sm sticky top-0">
            <div className="flex items-center space-x-2 text-[#5c6370]">
              <Edit3 className="w-5 h-5" />
              <span className="font-semibold tracking-wide text-sm">ZenPad</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#2c313a] text-[#5c6370] hover:text-white transition-colors"
                title="Close Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <button
                onClick={createNote}
                className="p-1.5 rounded-md hover:bg-[#2c313a] text-[#5c6370] hover:text-white transition-colors"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5c6370]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e2227] text-sm text-[#abb2bf] placeholder:text-[#5c6370] rounded border border-transparent pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#61afef] transition-all"
            />
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all ${
                activeNoteId === note.id
                  ? 'bg-[#2c313a] text-white'
                  : 'text-[#9da5b4] hover:bg-[#2c313a] hover:text-white'
              }`}
            >
              <div className="flex flex-col overflow-hidden mr-2 w-full">
                <span className="truncate text-sm font-medium">
                  {note.title}
                </span>
                <span className="truncate text-xs text-[#5c6370] mt-0.5">
                  {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded text-[#5c6370] hover:text-[#e06c75] transition-colors ${
                  activeNoteId === note.id ? 'opacity-100' : ''
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center text-[#5c6370] text-sm py-8">
              No notes found
            </div>
          )}
        </div>
      </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-[#1e2227] h-full overflow-hidden relative">
        {/* Editor Toolbar/Header */}
        <div className="h-12 shrink-0 border-b border-[#181a1f] bg-[#21252b] flex items-center justify-between px-4 z-10">
           <div className="flex items-center">
             {!isSidebarOpen && (
               <button
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-1.5 mr-3 bg-[#2c313a] text-[#abb2bf] rounded-md hover:bg-[#3e4451] hover:text-white transition-colors border border-[#181a1f]"
                 title="Open Sidebar"
               >
                 <PanelLeftOpen className="w-4 h-4" />
               </button>
             )}
             <span className="text-sm font-medium text-[#abb2bf]">
                {activeNote?.title || ''}
             </span>
           </div>
           
           {activeNote && (
             <div className="flex items-center space-x-1 border bg-[#181a1f] border-[#181a1f] rounded-md p-0.5">
                <button
                  onClick={() => setIsPlainTextMode(false)}
                  className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${!isPlainTextMode ? 'bg-[#3e4451] text-white shadow-sm' : 'text-[#5c6370] hover:text-[#abb2bf] hover:bg-[#2c313a]'}`}
                >
                  Rich
                </button>
                <button
                  onClick={() => setIsPlainTextMode(true)}
                  className={`px-3 py-1 text-xs font-medium rounded-sm transition-all ${isPlainTextMode ? 'bg-[#3e4451] text-white shadow-sm' : 'text-[#5c6370] hover:text-[#abb2bf] hover:bg-[#2c313a]'}`}
                >
                  Raw MD
                </button>
             </div>
           )}
        </div>

        <div className="flex-1 overflow-auto relative flex justify-center">
          {activeNote ? (
            <div className="w-full max-w-3xl pt-8 pb-32 px-4 sm:px-8">
               {isPlainTextMode ? (
                 <textarea
                   key={`textarea-${activeNote.id}`}
                   autoFocus
                   value={activeNote.content}
                   onChange={(e) => updateActiveNoteContent(e.target.value)}
                   className="w-full h-full min-h-[calc(100vh-200px)] bg-transparent text-[#abb2bf] font-mono text-[15px] leading-relaxed resize-none focus:outline-none placeholder:text-[#5c6370]"
                   placeholder="Type your markdown here..."
                 />
               ) : (
                 <MarkdownEditor
                   key={activeNote.id}
                   markdown={activeNote.content}
                   onChange={updateActiveNoteContent}
                 />
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#5c6370] h-full w-full">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No note selected</p>
              <p className="text-sm mt-1">Select a note from the sidebar or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
