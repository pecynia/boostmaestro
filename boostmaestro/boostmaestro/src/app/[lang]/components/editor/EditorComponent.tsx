"use client"

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { toast } from 'sonner'
import { RotateCw, Save } from 'lucide-react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import CustomBulletList from '@/app/[lang]/components/editor/CustomBulletList'
import { generateJSON } from '@tiptap/html'
import MenuBar from '@/app/[lang]/components/editor/MenuBar'
import { Button } from '@/app/[lang]/components/ui/button'
import EditorLocaleSwitcher from '@/app/[lang]/components/editor/EditorLocaleSwitcher'
import { Locale } from '@../../../i18n.config'
import { saveParagraph } from '@/app/_actions'
import { usePathname } from 'next/navigation'
import { StoryContent } from '@/../typings'

interface EditorComponentProps {
    initialContent: string
    editable?: boolean
    documentId: string
    currentLocale: Locale
    disableSave?: boolean
    onLocaleChange?: (newLocale: Locale) => void
    onContentChange?: (content: StoryContent) => void
}

const EditorComponent: React.FC<EditorComponentProps> = ({
    initialContent = '',
    editable = false,
    documentId,
    currentLocale,
    disableSave = false,
    onLocaleChange,
    onContentChange
}) => {
    const [editorContent, setEditorContent] = useState({})
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing...',
                emptyEditorClass: 'is-editor-empty',
            }),
            TextStyle,
            Color,
            CustomBulletList,
            Link.configure({
                openOnClick: true,
                autolink: true,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'hyperlink',
                },
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose max-w-none w-full',
            },
        },
        editable: editable,
        onUpdate: ({ editor }) => {
            const contentJson = generateJSON(editor.getHTML(), [StarterKit, TextStyle, Color, Link, CustomBulletList])
            setEditorContent(contentJson)
            setHasChanges(true)
            if (onContentChange) {
                onContentChange({
                    ...editorContent as StoryContent,
                    content: contentJson,
                    locale: currentLocale
                })
            }
        },
    })

    // Set the initial content if it exists
    useEffect(() => {
        if (initialContent) {
            editor?.commands.setContent(initialContent)
        }
    }, [initialContent, editor, currentLocale])

    const handleLocaleChange = (newLocale: Locale) => {
        if (onLocaleChange)
            onLocaleChange(newLocale) // Call the passed in onLocaleChange function
    }

    // Pathname
    const pathName = usePathname()

    // Make a post fetch request to secure API endpoint
    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await saveParagraph(documentId, currentLocale, JSON.stringify(editorContent), pathName)
            if (res.success) {
                toast.success('Saved successfully!')
            } else {
                toast.error('Oops, something went wrong. Please try again later.')
            }
            setHasChanges(false)
        } catch (error) {
            console.error('Failed to save:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='relative flex flex-col'>
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
            {editable && !disableSave && (
                <div className=''>

                    {/* Locale switcher, bottom left below the text area  */}
                    <div className="flex items-center justify-between">
                        <EditorLocaleSwitcher currentLocale={currentLocale} onLocaleChange={handleLocaleChange} />
                    </div>

                    {/* Save button, bottom right below the text area  */}
                    <div className="absolute bottom-0 right-0">
                        {hasChanges && (
                            isSaving ?
                                <Button disabled size="lg">
                                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                    Saving
                                </Button> :
                                <Button size="lg" onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditorComponent