import { NextRequest, NextResponse } from 'next/server'
import { getParagraphJson } from '@/lib/utils/db'
import { Locale } from '@../../../i18n.config'

export async function GET(request: NextRequest) {
    const documentId = request.headers.get('Document-ID') as string
    const locale = request.headers.get('Locale') as Locale

    console.log('api/content parameters=>', documentId, locale);
    // // Get the 'api-key' and verify it, otherwise return 401
    // const apiKey = request.headers.get('api-key')

    // if (apiKey !== process.env.ADMIN_PASSWORD) {
    //     return new Response('Unauthorized', { status: 401 })
    // }

    // Perform your data fetching logic here
    // const paragraph = await getParagraphJson(documentId, locale)
    const paragraph = await getParagraphJson(documentId, locale)
    return NextResponse.json({
        paragraph
    });
}
