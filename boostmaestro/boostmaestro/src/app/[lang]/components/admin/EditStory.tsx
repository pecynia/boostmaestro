"use client"

import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editStory } from "@/app/_actions"
import { Locale, i18n } from '@/../i18n.config'
import LocaleIcons from '@/app/[lang]/components/lang/LocaleIcon'
import { languages } from 'country-data'
import { StoryContent, StoryServer } from '@/../typings'
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
import { getFullStory } from '@/app/_actions'
import { Edit } from 'lucide-react'
import { Badge } from '../ui/badge'

interface EditStoryProps {
  storySlug: string
  lang: Locale
}

const EditStory: React.FC<EditStoryProps> = ({ storySlug, lang }) => {
  const { data: session } = useSession();
  const [selectedLocale, setSelectedLocale] = useState<Locale>(lang);
  const [isEditing, setIsEditing] = useState(false);
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(i18n.locales.indexOf(lang));
  const [story, setStory] = useState<StoryServer | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      const storyData = await getFullStory(storySlug);
      setStory(storyData);
    };

    fetchStory();
  }, [storySlug]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StoryContent>({
    resolver: zodResolver(StoryContentSchema),
  });

  useEffect(() => {
    if (story && selectedLocale) {
      reset(story.content[selectedLocale]);
    }
  }, [story, selectedLocale, reset]);

  const handleLanguageChange = (locale: Locale) => {
    setSelectedLocale(locale);
    setActiveLanguageIndex(i18n.locales.indexOf(locale));
    if (story) {
      reset(story.content[locale]);
    }
  };

  const handleStoryContentChange = (updatedField: Partial<StoryContent>) => {
    setStory(prevStory => {
      if (!prevStory) return null;  // Handling null case

      const updatedContent = {
        ...prevStory.content[selectedLocale],
        ...updatedField,
      };

      return {
        ...prevStory,
        content: {
          ...prevStory.content,
          [selectedLocale]: updatedContent,
        },
      };
    });
  };


  const processForm: SubmitHandler<StoryContent> = async (data) => {
    if (!session || !story) {
      console.error("No session or story found!");
      return;
    }

    const updatedContent = {
      ...story.content[selectedLocale],
      ...data,
    };

    try {
      const updatedStoryData: StoryServer = {
        ...story,
        content: {
          ...story.content,
          [selectedLocale]: updatedContent,
        },
      };

      const paths = [
        `${process.env.NEXT_PUBLIC_URL}/${selectedLocale}/blog`,
        `${process.env.NEXT_PUBLIC_URL}/${selectedLocale}/blog/${storySlug}`,
      ];

      const result = await editStory(updatedStoryData, paths);

      if (result.success) {
        console.log("Story updated successfully");
        toast.success("Story updated successfully");
      } else {
        console.error("Failed to update story", result.error);
        toast.error("Failed to update story");
      }
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Error updating story");
    }
  };

  if (!story) {
    return null;
  }
  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild onClick={() => setIsEditing(true)} >
        <Badge variant='outline' className="hover:cursor-pointer">
          <Edit size={16} />
        </Badge>

      </DialogTrigger>

      <DialogContent className='h-[80vh] min-w-[80vw] flex flex-col gap-3'>
        <DialogTitle>Edit Story</DialogTitle>

        <Tabs value={selectedLocale} className="w-full flex-1">
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
                {story.content[locale] && (
                  <CheckCircle size={16} />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className='flex-1 overflow-y-auto'>
            {i18n.locales.map((locale) => (
              <TabsContent key={locale} value={locale}>
                <div className='flex flex-1 flex-col gap-3 h-[54vh] overflow-y-auto'>
                  <form onSubmit={handleSubmit(processForm)} className='flex flex-1 flex-col gap-3 p-2'>
                    <Input
                      {...register('title')}
                      placeholder='Title'
                      className='w-1/3 text-md'
                      defaultValue={story.content[selectedLocale]?.title || ''}
                      onChange={(e) =>
                        handleStoryContentChange({ title: e.target.value })
                      }
                    />

                    {errors.title && <p className='text-red-500 text-sm -mt-2'>{errors.title.message}</p>}

                    <Textarea
                      {...register('description')}
                      placeholder='Description'
                      className='text-md'
                      defaultValue={story.content[selectedLocale]?.description || ''}
                      onChange={(e) =>
                        handleStoryContentChange({ description: e.target.value })
                      }
                    />

                    {errors.description && <p className='text-red-500 text-sm -mt-2'>{errors.description.message}</p>}

                    <div className='editor-wrapper w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'>
                      {session && <EditorComponent
                        currentLocale={selectedLocale}
                        documentId={storySlug}
                        editable={!!session}
                        initialContent={generateHTML(story.content[selectedLocale]?.content || {}, [
                          StarterKit,
                          TextStyle,
                          Color,
                          TiptapLink,
                        ])}
                        onContentChange={(newContent) =>
                          handleStoryContentChange({ content: newContent.content })
                        }
                        disableSave={true}
                      />

                      }
                    </div>
                  </form>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <Button type='submit' className='absolute bottom-6 right-4' disabled={isSubmitting} onClick={handleSubmit(processForm)}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default EditStory