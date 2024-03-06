import { getParagraphJson } from '@/lib/utils/db'

import React from 'react'
import { Locale } from '@../../../i18n.config'
import EditorContent from '@/app/[lang]/components/editor/EditorContent'
import OpenEditorButton from '@/app/[lang]/components/editor/OpenEditorButton'
import { JSONContent } from '@tiptap/react'

type Reponse = {
    _id: string
    paragraphJson: JSONContent
} | null


async function EditorServer({ initialLocale, documentId, className }: { initialLocale: Locale, documentId: string, className?: string }) {

    const result = await getParagraphJson(documentId, initialLocale) as Reponse

    // Check if result is null and handle it
    if (!result) {
        console.error(`No data found for documentId: ${documentId} and locale: ${initialLocale}`)
    }

    return (
        <div className="relative group">
            <EditorContent result={result} className={className} />
            <OpenEditorButton initialLocale={initialLocale} documentId={documentId} className='' />
        </div>
    )
}

export default EditorServer