import Link from "next/link"
import React from 'react'
import { Locale } from "@../../../i18n.config"
import { getStories } from "@/lib/utils/db"
import EditorServer from "@/app/[lang]/components/editor/EditorServer"
import AddStory from "@/app/[lang]/components/admin/AddStory"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/[lang]/components/ui/card"
import DeleteStory from "@/app/[lang]/components/admin/DeleteStory"
import EditStory from "@/app/[lang]/components/admin/EditStory"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"


export const revalidate = 1800


export default async function Page({
    params: { lang }
}: {
    params: { lang: Locale }
}) {
    const stories = await getStories(lang)
    const session = await getServerSession(authOptions)

    return (
        <div className="container mx-auto px-4 py-8">
            <EditorServer documentId="blog-title" initialLocale={lang} />
            {session && (
                <div className="mb-8">
                    <AddStory lang={lang} />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => {
                    const { slug, title, date, description, views } = story
                    if (!title) {
                        return null
                    }
                    return (
                        <Card key={slug} className="shadow-right-tertiary border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">
                                        <Link href={`/${lang}/blog/${slug}`}>
                                            <span className="text-primary hover:underline">
                                                {title}
                                            </span>
                                        </Link>
                                    </CardTitle>
                                    {session && (
                                        <div className="flex space-x-2">
                                            <EditStory storySlug={slug} lang={lang} />
                                            <DeleteStory storySlug={slug} lang={lang} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Published: {new Date(date).toLocaleDateString()}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {description}
                                </CardDescription>
                                {session && (
                                    <p className="text-sm text-gray-500 mt-4">
                                        Views: {views}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}