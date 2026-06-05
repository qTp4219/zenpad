'use client';

import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  type MDXEditorMethods
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useRef } from 'react';

import { oneDark } from '@codemirror/theme-one-dark';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function MarkdownEditor({ markdown, onChange }: MarkdownEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  // We use key={id} in the parent to recreate this component on note change.
  // The 'markdown' prop acts as the initial value.
  return (
    <div className="mdx-editor-wrapper prose prose-invert prose-p:text-[#abb2bf] prose-headings:text-white prose-a:text-[#61afef] prose-strong:text-[#e06c75] prose-li:text-[#abb2bf] prose-code:text-[#98c379] prose-code:bg-[#282c34] prose-code:px-1 prose-code:rounded prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf] prose-blockquote:text-[#5c6370] prose-blockquote:border-[#c678dd] h-full max-w-none">
      <MDXEditor
        ref={ref}
        className="dark-theme dark-editor"
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="outline-none min-h-screen px-8 py-12 text-lg text-[#abb2bf] font-sans"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
          codeMirrorPlugin({ 
            codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Text', typescript: 'TypeScript', ts: 'TypeScript', python: 'Python', json: 'JSON', html: 'HTML', markdown: 'Markdown' },
            codeMirrorExtensions: [oneDark]
          }),
          tablePlugin(),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  );
}
