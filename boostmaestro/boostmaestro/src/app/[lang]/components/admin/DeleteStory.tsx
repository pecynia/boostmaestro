"use client"

import React from 'react'
import { removeStory } from "@/app/_actions"
import { Locale } from '@/../i18n.config'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/[lang]/components/ui/alert-dialog"
import { toast } from 'sonner'
import { Badge } from '@/app/[lang]/components/ui/badge'
import { Trash2 } from 'lucide-react'

interface DeleteStoryProps {
  storySlug: string
  lang: Locale
}

const DeleteStory: React.FC<DeleteStoryProps> = ({ storySlug, lang }) => {
  const paths = [
    `${process.env.NEXT_PUBLIC_URL}/${lang}/blog`,
    `${process.env.NEXT_PUBLIC_URL}/${lang}/blog/${storySlug}`
  ]

  const handleDelete = async () => {
    try {
      const result = await removeStory(storySlug, paths)
      if (result?.success) {
        toast.success('Story successfully deleted')
      } else {
        toast.error('Failed to delete story')
      }
    } catch (error) {
      console.error("Failed to delete story:", error)
      toast.error('An error occurred while deleting the story. Refresh the page and try again.')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Badge variant='destructive' className="hover:cursor-pointer">
          <Trash2 size={16} />
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the story from your blog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteStory