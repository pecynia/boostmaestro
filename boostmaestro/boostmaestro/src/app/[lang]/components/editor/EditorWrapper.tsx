"use client"

import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useSession } from 'next-auth/react'
import { generateHTML } from '@tiptap/html'
import { ReloadIcon } from "@radix-ui/react-icons"
import EditorComponent from "@/app/[lang]/components/editor/EditorComponent"
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Link as TiptapLink } from "@tiptap/extension-link"
import { Button } from "@/app/[lang]/components/ui/button"
import { Locale } from "@../../../i18n.config"
import { twMerge } from "tailwind-merge"
import { motion } from "framer-motion"
import { getParagraph } from "@/app/_actions"
import { StoryContent } from '@/../typings'

export interface EditorWrapperProps {
    documentId: string
    link?: string
    buttonText?: string
    initialLocale: Locale
    className?: string
    disableSave?: boolean
    onContentChange: (content: StoryContent) => void
}

const EditorWrapper: React.FC<EditorWrapperProps> = ({ documentId, link, buttonText, initialLocale, className, disableSave, onContentChange }) => {
    const { status, data: session } = useSession()
    const [fetchedContent, setFetchedContent] = useState('')

    const [currentLocale, setCurrentLocale] = useState(initialLocale)

    const handleLocaleChange = useCallback(async (newLocale: Locale) => {
        const response = await getParagraph(documentId, newLocale)

        if (response.success) {
            const contentAsHtml = generateHTML(response.data!.paragraphJson, [
                StarterKit,
                TextStyle,
                Color,
                TiptapLink,
            ])
            setFetchedContent(contentAsHtml)
        } else {
            console.error('Error fetching content:', response.error)
        }
    }, [documentId])

    useEffect(() => {
        handleLocaleChange(currentLocale)
    }, [currentLocale, handleLocaleChange])

    if (status === "loading") {
        return (
            <motion.div className="flex justify-center items-center mt-5 w-full h-full">
                <ReloadIcon className="w-4 h-4 animate-spin" />
            </motion.div>
        )
    }

    return (
        <div className={twMerge("w-full", className)}>
            <EditorComponent
                currentLocale={currentLocale}
                documentId={documentId}
                editable={!!session}
                initialContent={fetchedContent}
                onLocaleChange={setCurrentLocale}
            />
            {link && buttonText && (
                <div className="px-4 flex justify-center">
                    <Button variant='secondary' className="rounded-lg mt-4" size='lg'>
                        <Link href={link}>
                            <p>{buttonText}</p>
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default EditorWrapper