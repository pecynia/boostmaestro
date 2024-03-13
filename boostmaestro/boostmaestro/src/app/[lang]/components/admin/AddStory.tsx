"use client"

import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveStory } from "@/app/_actions"
import { Locale, i18n } from '@../../../i18n.config'
import LocaleIcons from '@/app/[lang]/components/lang/LocaleIcon'
import { Story, StoryContent } from '@/../typings'
import { StoryContentSchema } from "@/lib/schema"
import { useSession } from 'next-auth/react'
import { Button } from '@/app/[lang]/components/ui/button'
import EditorWrapper from "@/app/[lang]/components/editor/EditorWrapper"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/app/[lang]/components/ui/dialog"
import { Textarea } from '@/app/[lang]/components/ui/textarea'
import { Pencil } from 'lucide-react'
import { Input } from '@/app/[lang]/components/ui/input'

const AddStory: React.FC<{ lang: Locale }> = ({ lang }) => {
  const { data: session } = useSession()
  const [slug, setSlug] = useState('')
  const [isSlugEditorOpen, setIsSlugEditorOpen] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<StoryContent>({
    resolver: zodResolver(StoryContentSchema),
    defaultValues: {
      title: '',
      description: '',
      locale: i18n.defaultLocale,
      content: undefined,
      date: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      views: 0,
      tags: [],
    }
  })

  const title = watch('title')

  useEffect(() => {
    if (!isSlugEditorOpen) {
      setSlug(title.toLowerCase().replace(/ /g, '-'))
    }
  }, [title, isSlugEditorOpen])

  const processForm: SubmitHandler<StoryContent> = async (data) => {
    if (!session) {
      console.error("No session found!")
      return
    }

    try {
      const newStoryData = {
        slug,
        content: { [data.locale]: data }
      } as Story

      const result = await saveStory(newStoryData)

      if (result.success) {
        console.log("Story added successfully")
      } else {
        console.error("Failed to add story", result.error)
      }
    } catch (error) {
      console.error("Error saving story:", error)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  if (!session) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Story</Button>
      </DialogTrigger>
      <DialogContent className='h-[80vh] min-w-[80vw] flex flex-col gap-3'>
        <DialogTitle>Add Story</DialogTitle>
        <div className='overflow-y-auto'>
          <form onSubmit={handleSubmit(processForm)} className='flex flex-1 flex-col gap-3 p-2'>
            <Input {...register('title')} placeholder='Title' className='w-1/3 text-md' />
            {errors.title && <p className='text-red-500 text-sm -mt-2'>{errors.title.message}</p>}

            <div className='flex items-center -mt-1 ml-3'>
              <p className='text-sm text-gray-400'>
                {process.env.NEXT_PUBLIC_URL}/{lang}/blog/
              </p>
              {slug && (
                <div className='flex items-center -ml-3 -my-2'>
                  <Button onClick={() => setIsSlugEditorOpen(true)} variant="link" className="flex items-center hover:cursor-text">
                    <span className='text-sm'>{slug}</span>
                    <Pencil size={15} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>


            <Dialog open={isSlugEditorOpen} onOpenChange={setIsSlugEditorOpen}>
              <DialogContent>
                <DialogTitle>Edit Slug</DialogTitle>
                <Input value={slug} onChange={handleSlugChange} placeholder='Slug' />
                <Button onClick={() => setIsSlugEditorOpen(false)}>Save</Button>
              </DialogContent>
            </Dialog>

            <Textarea {...register('description')} placeholder='Description' className='text-md'/>
            {errors.description && <p className='text-red-500 text-sm -mt-2'>{errors.description.message}</p>}

            <EditorWrapper documentId={slug} initialLocale={lang} />

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Story'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddStory
