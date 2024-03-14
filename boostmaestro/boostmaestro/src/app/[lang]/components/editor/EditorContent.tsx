"use client"

import React, { useMemo } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CustomBulletList from './CustomBulletList'
import Link from '@tiptap/extension-link'
import { generateHTML } from '@tiptap/html'
import { twMerge } from 'tailwind-merge'
import { Reponse } from '@/app/[lang]/components/editor/EditorServer'

function EditorContent({ result, className }: { result: Reponse, className?: string}) {

    const output = useMemo(() => {
        if (result && result.paragraphJson) {
            return generateHTML(result.paragraphJson, [
                StarterKit,
                Placeholder.configure({
                    placeholder: 'Start typing...',
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
            ])
        }
        return '<p></p>'
    }, [result])

    return (
        <div className={twMerge("w-full", className)}>
            <div
                className="tiptap w-full prose max-w-none"
                dangerouslySetInnerHTML={{ __html: output }}
            />
        </div>
    )
}

export default EditorContent
