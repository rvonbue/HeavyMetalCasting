import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1 text-sm border transition-colors ${active ? 'bg-hmc-button-a text-hmc-button-text-a border-hmc-border-a' : 'border-hmc-border-b text-hmc-textprimary hover:border-hmc-border-a'}`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter description…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value ?? '')
    }
  }, [value])

  if (!editor) return null

  return (
    <div className="border border-hmc-border-b focus-within:border-hmc-border-a">
      <div className="flex flex-wrap gap-1 p-2 border-b border-hmc-border-b bg-hmc-panelbackground">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          ≡
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          1.
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">
          H
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[8rem] px-3 py-2 text-sm text-hmc-textprimary bg-hmc-panelbackground prose prose-sm max-w-none text-left focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[7rem] [&_.ProseMirror]:text-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-hmc-textsecondary/50 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}
