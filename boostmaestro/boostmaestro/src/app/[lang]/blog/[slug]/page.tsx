import React from 'react'
import { getAllStorySlugs, getStoryBySlug } from '@/lib/utils/db'
import { Locale } from '@../../../i18n.config'
import EditorContent from '@/app/[lang]/components/editor/EditorContent'
import { StoryContent } from '@../../../../../typings'
import { Reponse } from '@/app/[lang]/components/editor/EditorServer'
import ViewCounter from '@/app/[lang]/components/ViewCounter'

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

    const story = await getStoryBySlug(slug, lang) as StoryContent

    const contentResult = {
        _id: "unrelevant-blog-id",
        paragraphJson: story.content
    } as Reponse

    return (
        <>
            <ViewCounter slug={slug} locale={lang} />
            <article>
                <h1 className='text-3xl'>{story.title}</h1>
                <p>{story.description}</p>
                <EditorContent result={JSON.parse(JSON.stringify(contentResult))} />
            </article>
        </>

    )

}

