import React from 'react'
import { getAllStorySlugs, getStoryBySlug } from '@/lib/utils/db'
import { Locale } from '@../../../i18n.config'
import EditorContent from '@/app/[lang]/components/editor/EditorContent'
import { StoryContent } from '@../../../../../typings'
import { Reponse } from '@/app/[lang]/components/editor/EditorServer'
import ViewCounter from '@/app/[lang]/components/ViewCounter'
import { addBlogJsonLd } from '@/lib/utils/schemas/blog-schema'
import { getDictionary } from '@/lib/dictionary'

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
    const { notFound } = await getDictionary(lang)

    if (!story) {
        return (
            <div className='flex flex-col items-center justify-center h-96'>
                <h1 className='text-2xl'>{notFound.postNotFound}</h1>
            </div>
        )
    }

    const contentResult = {
        _id: "unrelevant-blog-id",
        paragraphJson: story.content
    } as Reponse

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={addBlogJsonLd(lang, story, slug)}
            />
            <ViewCounter slug={slug} locale={lang} />
            <article className='container mx-auto px-4 py-8 space-y-2'>
                <p className='text-gray-500'>{new Date(story.date).toLocaleDateString()}</p>
                <h1 className='text-4xl font-bold'>{story.title}</h1>
                <EditorContent result={JSON.parse(JSON.stringify(contentResult))} />
            </article>
        </>

    )

}

