import Link from "next/link"
import React from 'react'
import { Locale } from "@../../../i18n.config"
import { getStories } from "@/lib/utils/db"
import EditorServer from "@/app/[lang]/components/editor/EditorServer"
import AddStory from "@/app/[lang]/components/admin/AddStory"

export default async function Page({
    params: { lang }
}: {
    params: { lang: Locale }
}) {

    const stories = await getStories(lang)

    return (
        <div className="container mx-auto px-4 py-4 ">
            <EditorServer documentId="blog-title" initialLocale={lang} />
            <AddStory lang={lang} />
            <ul>
                {stories.map((story) => (
                    <li key={story.slug}>
                        <Link href={`/${lang}/blog/${story.slug}`} className="shadow-md">
                            <p className="text-blue-500 hover:underline">
                                {story.title}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}