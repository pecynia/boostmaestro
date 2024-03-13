import React from 'react'
import { getAllStorySlugs, getStoryBySlug } from '@/lib/utils/db'
import { Locale } from '@../../../i18n.config'


export async function generateStaticParams() {
    const slugs = await getAllStorySlugs()

    return slugs.map((slug) => {
        return slug
    })
}

export default async function Page({
    params: { lang, slug }
}: {
    params: { lang: Locale, slug: string }
}) {

    const story = await getStoryBySlug(slug, lang)

    return (
        <div>{story.title}</div>
    )

}

