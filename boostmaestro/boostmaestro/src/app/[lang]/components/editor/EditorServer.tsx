// import { getParagraphJson } from '@/lib/utils/db'

// import React from 'react'
import { Locale } from '@../../../i18n.config'
import EditorContent from '@/app/[lang]/components/editor/EditorContent'
import OpenEditorButton from '@/app/[lang]/components/editor/OpenEditorButton'
import { JSONContent } from '@tiptap/react'

type Reponse = {
    _id: string
    paragraphJson: JSONContent
} | null


async function fetchParagraph(documentId: string, locale: Locale) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Document-ID': documentId,
                'Locale': locale,
                // 'api-key': process.env.ADMIN_PASSWORD!
            },
            next: {
                tags: [`fetch-paragraph-${documentId}`]
            },
            // cache: 'no-cache'
        })

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        return response.json()
    }
    catch (error) {
        console.error("Error in fetchParagraph:", error)
        return null
    }
}

async function EditorServer({ initialLocale, documentId, className }: { initialLocale: Locale, documentId: string, className?: string }) {

    // const result = await getParagraphJson(documentId, initialLocale) as Reponse  // SSG
    const result = await fetchParagraph(documentId, initialLocale) as Reponse  // ISR

    // Check if result is null and handle it
    if (!result) {
        console.error(`No data found for documentId: ${documentId} and locale: ${initialLocale}`)
    }

    return (
        <div className="relative group">
            <EditorContent result={result} className={className} />
            <OpenEditorButton initialLocale={initialLocale} documentId={documentId} />
        </div>
    )
}

export default EditorServer