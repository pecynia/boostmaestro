"use client"

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveStory } from "@/app/_actions"
import { Locale, i18n } from '@/../i18n.config'
import LocaleIcons from '@/app/[lang]/components/lang/LocaleIcon'
import { languages } from 'country-data'
import { Story, StoryContent } from '@/../typings'
import { StoryContentSchema } from "@/lib/schema"
import { useSession } from 'next-auth/react'
import { Button } from '@/app/[lang]/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/app/[lang]/components/ui/dialog"
import { Textarea } from '@/app/[lang]/components/ui/textarea'
import { Input } from '@/app/[lang]/components/ui/input'
import Image from 'next/image'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs"
import { CheckCircle } from 'lucide-react'
import EditorComponent from '@/app/[lang]/components/editor/EditorComponent'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Link as TiptapLink } from "@tiptap/extension-link"

type StoryContentWithSaved = StoryContent & { saved: boolean }

type StoryState = {
  [key in Locale]: StoryContentWithSaved
}

const AddStory: React.FC<{ lang: Locale }> = ({ lang }) => {
  const { data: session } = useSession()
  const [slug, setSlug] = useState('')
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null)
  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false)
  const [isFillingForm, setIsFillingForm] = useState(false)
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(0)

  const activeLanguage = i18n.locales[activeLanguageIndex]

  const initialStoryState: StoryState = i18n.locales.reduce((acc, locale) => {
    acc[locale] = {
      title: '',
      description: '',
      locale,
      content: {
        type: 'doc',
        content: [{
          type: 'paragraph',
        }]
      },
      date: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      views: 0,
      tags: [],
      saved: false,
    }
    return acc;
  }, {} as StoryState);


  const [storyContent, setStoryContent] = useState<StoryState>(initialStoryState)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StoryContent>({
    resolver: zodResolver(StoryContentSchema),
    defaultValues: {
      title: '',
      description: '',
      locale: lang,
      content: undefined,
      date: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      views: 0,
      tags: [],
    }
  })

  const handleLanguageChange = (locale: Locale) => {
    setSelectedLocale(locale)
    setActiveLanguageIndex(i18n.locales.indexOf(locale))

    reset({
      title: storyContent[locale].title,
      description: storyContent[locale].description,
      locale: locale,
      content: storyContent[locale].content,
      date: storyContent[locale].date,
      dateModified: storyContent[locale].dateModified,
      views: storyContent[locale].views,
      tags: storyContent[locale].tags,
    })
  }

  const handleSaveLanguage = () => {
    setStoryContent((prevContent) => ({
      ...prevContent,
      [activeLanguage]: {
        ...prevContent[activeLanguage],
        saved: true,
      },
    }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  const handleStoryContentChange = (content: StoryContent) => {
    setStoryContent((prevContent) => ({
      ...prevContent,
      [activeLanguage]: {
        ...prevContent[activeLanguage],
        ...content,
      },
    }))
  }

  const processForm: SubmitHandler<StoryContent> = async (data) => {
    if (!session) {
      console.error("No session found!")
      return
    }

    try {
      const newStoryData: Story = {
        slug,
        content: i18n.locales.reduce((acc, locale) => {
          acc[locale] = storyContent[locale]
          return acc
        }, {} as Record<Locale, StoryContent>),
      }

      const paths = [
        `${process.env.NEXT_PUBLIC_URL}/${lang}/blog`,
        `${process.env.NEXT_PUBLIC_URL}/${lang}/blog/${slug}`
      ]
      const result = await saveStory(JSON.parse(JSON.stringify(newStoryData)), paths)

      if (result.success) {
        console.log("Story added successfully")
        toast.success("Story added successfully")
      } else {
        console.error("Failed to add story", result.error)
        toast.error("Failed to add story")
      }
    } catch (error) {
      console.error("Error saving story:", error)
      toast.error("Error saving story")
    }
  }

  return (
    <>
      <Dialog open={isSelectingLanguage} onOpenChange={setIsSelectingLanguage}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsSelectingLanguage(true)}>Add Story</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose Starting Language</DialogTitle>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {i18n.locales.map((locale) => (
              <Button key={locale} onClick={() => {
                setSelectedLocale(locale)
                setActiveLanguageIndex(i18n.locales.indexOf(locale))
                setIsFillingForm(true)
                setIsSelectingLanguage(false)
              }}
                variant='ghost'
                className="flex flex-col items-center justify-center py-2 h-full"
              >
                <Image
                  src={LocaleIcons[locale]}
                  alt={locale.toUpperCase()}
                  width={56}
                  height={56}
                  className="mb-2"
                />
                <span>
                  {languages.all.find(lang => lang.alpha2 === locale)?.name || locale.toUpperCase()}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {isFillingForm && (
        <Dialog open={isFillingForm} onOpenChange={setIsFillingForm}>
          <DialogContent className='h-[80vh] min-w-[80vw] flex flex-col gap-3'>

            {/* Dialog title  */}
            <DialogTitle>Add Story</DialogTitle>

            {/* Slug input  */}
            <div className='mb-2'>
              <div className='flex items-center ml-3'>
                <p className='text-sm text-gray-400'>
                  {process.env.NEXT_PUBLIC_URL}/{selectedLocale}/blog/
                </p>
                <Input
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder='Slug'
                  className='ml-2 w-1/3 sm:w-1/3 h-8'
                />
              </div>
            </div>

            {/* Main content */}
            <Tabs value={activeLanguage} className="w-full flex-1">

              {/* Language Selection */}
              <TabsList className="ml-2 mb-4">
                {i18n.locales.map((locale) => (
                  <TabsTrigger
                    key={locale}
                    value={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={LocaleIcons[locale]}
                      alt={locale.toUpperCase()}
                      width={24}
                      height={24}
                    />
                    <span>{languages.all.find(lang => lang.alpha2 === locale)?.name || locale.toUpperCase()}</span>
                    {storyContent[locale].saved && (
                      <CheckCircle size={16} />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Blog content */}
              <div className='flex-1 overflow-y-auto'>
                {i18n.locales.map((locale) => (
                  <TabsContent key={locale} value={locale}>
                    <div className='flex flex-1 flex-col gap-3 h-[54vh] overflow-y-auto'>
                      <form onSubmit={handleSubmit(processForm)} className='flex flex-1 flex-col gap-3 p-2'>
                        <Input
                          {...register('title')}
                          placeholder='Title'
                          className='w-1/3 text-md'
                          value={storyContent[locale].title}
                          onChange={(e) =>
                            setStoryContent((prevContent) => ({
                              ...prevContent,
                              [locale]: {
                                ...prevContent[locale],
                                title: e.target.value,
                              },
                            }))
                          }
                        />
                        {errors.title && <p className='text-red-500 text-sm -mt-2'>{errors.title.message}</p>}

                        <Textarea
                          {...register('description')}
                          placeholder='Description'
                          className='text-md'
                          value={storyContent[locale].description}
                          onChange={(e) =>
                            setStoryContent((prevContent) => ({
                              ...prevContent,
                              [locale]: {
                                ...prevContent[locale],
                                description: e.target.value,
                              },
                            }))
                          }
                        />
                        {errors.description && <p className='text-red-500 text-sm -mt-2'>{errors.description.message}</p>}

                        <div className='editor-wrapper w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'>
                          {session && <EditorComponent
                            currentLocale={locale}
                            documentId={slug}
                            editable={!!session}
                            initialContent={generateHTML(storyContent[locale].content, [
                              StarterKit,
                              TextStyle,
                              Color,
                              TiptapLink,
                            ])}
                            onContentChange={handleStoryContentChange}
                            disableSave={true}
                          />
                          }
                        </div>

                        <Button type="button" onClick={handleSaveLanguage} className="mt-2" variant='outline'>
                          { !storyContent[locale].saved ?
                            `Mark ${languages.all.find(lang => lang.alpha2 === locale)?.name || locale.toUpperCase()} as done` : 'Marked as done'
                          }
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            <Button type='submit' className='absolute bottom-6 right-4' disabled={isSubmitting} onClick={handleSubmit(processForm)}>
              {isSubmitting ? 'Adding...' : 'Add Story'}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default AddStory