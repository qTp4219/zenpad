import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ZenPad',
  description: 'Minimalist WYSIWYG Markdown Notepad',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark dark-theme dark-editor">
      <body className="bg-[#0f1115] text-[#9da5b4] min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
