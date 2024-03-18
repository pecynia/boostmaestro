"use client"

import { Editor } from '@tiptap/react'
import { Button } from '@/app/[lang]/components/ui/button'
import {
    Bold,
    Italic,
    Strikethrough,
    RemoveFormatting,
    Pilcrow,
    SeparatorHorizontal,
    Space,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    ListOrdered,
    Undo,
    Redo,
    List,
    Eraser,
    Link,
    Unlink,
    Anchor,
    Palette,
    CheckCheckIcon,
    ListChecks,
} from 'lucide-react'
import { Separator } from '@/app/[lang]/components/ui/separator'
import { hslToHex } from '@/lib/utils/hexToHsl'
import { useCallback, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/[lang]/components/ui/dialog"
import { Input } from '@/app/[lang]/components/ui/input'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [url, setUrl] = useState('')

    const openDialog = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href || ''
        setUrl(previousUrl)
        setIsDialogOpen(true)
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return

        if (url === null) {
            return // Cancelled
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run() // Empty, remove link
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run() // Set/update link
        setIsDialogOpen(false) // Close dialog after setting the link
    }, [url, editor])

    const unsetLink = useCallback(() => {
        if (!editor || !editor.isActive('link')) return

        editor.chain().focus().unsetLink().run()
    }, [editor])

    if (!editor) {
        return null
    }


    return (
        <div className='top-0 pb-2'>
            <div className=''>
                <Button type="button" variant='ghost' size='sm'
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={editor.isActive('bold') ? 'bg-secondary text-white' : ''}
                >
                    <Bold className='w-4 h-4' />
                </Button>

                <Button type="button" variant='ghost' size='sm'
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive('italic') ? 'bg-secondary' : ''}
                >
                    <Italic className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size='sm'
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive('strike') ? 'bg-secondary' : ''}
                >
                    <Strikethrough className='w-4 h-4' />
                </Button>

                {/* Link Button to Open Dialog */}
                <Button type="button"
                    variant='ghost'
                    size='sm'
                    onClick={openDialog}
                    className={editor.isActive('link') ? 'bg-secondary' : ''}
                >
                    <Link className='w-4 h-4' />
                </Button>

                {/* Link Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Set Link</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full"
                        />
                        <DialogFooter>
                            <Button type="button" onClick={setLink}>Set Link</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Unlink Button */}
                <Button type="button"
                    variant='ghost'
                    size='sm'
                    onClick={unsetLink}
                    disabled={!editor.isActive('link')}
                >
                    <Unlink className='w-4 h-4' />
                </Button>


                {/* Text colours */}
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().setColor(hslToHex(getComputedStyle(document.documentElement).getPropertyValue('--primary'))).run()}
                    className={editor.isActive('textStyle', { color: 'secondary' }) ? 'bg-secondary' : ''}
                >
                    <div className='bg-primary rounded-full w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().setColor(hslToHex(getComputedStyle(document.documentElement).getPropertyValue('--secondary'))).run()}
                    className={editor.isActive('textStyle', { color: 'secondary' }) ? 'bg-secondary' : ''}
                >
                    <div className='bg-secondary rounded-full w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().setColor(hslToHex(getComputedStyle(document.documentElement).getPropertyValue('--secondary-foreground'))).run()}
                    className={editor.isActive('textStyle', { color: 'secondary' }) ? 'bg-secondary' : ''}
                >
                    <div className='bg-secondary-foreground rounded-full w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().setColor(hslToHex(getComputedStyle(document.documentElement).getPropertyValue('--tertiary'))).run()}
                    className={editor.isActive('textStyle', { color: 'secondary' }) ? 'bg-secondary' : ''}
                >
                    <div className='bg-tertiary rounded-full w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
                >
                    <Heading1 className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
                >
                    <Heading2 className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-secondary' : ''}
                >
                    <Heading3 className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size='sm'
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    <RemoveFormatting className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm" onClick={() => editor.chain().focus().clearNodes().run()}>
                    <Eraser className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'bg-secondary' : ''}
                >
                    <Pilcrow className='w-4 h-4' />
                </Button>

                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
                >
                    <ListChecks className='w-5 h-5' />
                </Button>

                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
                >
                    <ListOrdered className='w-5 h-5' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-secondary' : ''}
                >
                    <Quote className='w-3 h-3' />
                </Button>
                <Button type="button" variant='ghost' size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <SeparatorHorizontal className='w-4 h-4' />
                </Button >
                <Button type="button" variant='ghost' size="sm" onClick={() => editor.chain().focus().setHardBreak().run()}>
                    <Space className='w-4 h-4' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                >
                    <Undo className='w-6 h-6' />
                </Button>
                <Button type="button" variant='ghost' size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                >
                    <Redo className='w-6 h-6' />
                </Button>
            </div>
        </div>
    )
}

export default MenuBar