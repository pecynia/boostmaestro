import { StoryContent } from "@../../../typings"
import { Locale } from '@/app/../../i18n.config'

export function addBlogJsonLd(lang: Locale, story: StoryContent, slug: string) {
    return {
      __html: `{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/blog/${slug}"
        },
        "headline": "${story.title}",
        "description": "${story.description}",
        "image": [],
        "author": {
          "@type": "Person",
          "url": "${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/blog/${slug}",
          "name": "Guus Krabbenborg"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ERP Masterclasses",
          "logo": {
            "@type": "ImageObject",
            "url": "${process.env.NEXT_PUBLIC_BASE_URL}/logo.png"
          }
        },
        "datePublished": "${story.date}",
        "dateModified": "${story.dateModified}"
      }`
    }
}
