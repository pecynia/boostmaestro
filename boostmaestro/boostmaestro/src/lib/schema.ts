import { z } from 'zod'
import { Locale, i18n } from '@../../../i18n.config'
import { eventTypes, EventType } from '@../../../event.config'

// 1: Required
// 2: Invalid 
export const ContactFormSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().min(1, { message: '1' }).email('2'),
  message: z.string()
    .min(1, { message: '1.' })
    .min(6, { message: '2' })
})

export const AdditionalRegistrationFormSchema = z.object({
  nameParticipant: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().min(1, { message: '1' }).email('2'),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  position: z.string().min(1, { message: 'Position is required.' }),
})

export const RegistrationFormSchema = z.object({
  selectedEvent: z.object({
    _id: z.string(),
    title: z.string(),
    eventSlug: z.string(),
    description: z.string(),
    price: z.number(),
    type: z.string(),
    date: z.date(),
    location: z.string().optional(),
    requiredRegistrations: z.number(),
    language: z.string(),
    shownLanguages: z.array(z.string()),
    stripePriceId: z.string(),
    stripeProductId: z.string()
  }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  companyWebsite: z.string().min(1, { message: 'Company website is required.' }),
  address: z.string().min(1, { message: 'Adress is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
  nameParticipant: z.string().min(1, { message: 'Name is required.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  email: z.string().min(1, { message: '1' }).email('2'),
  position: z.string().min(1, { message: 'Position is required.' }),
  vatNumber: z.string().min(1, { message: 'VAT number is required.' }),
  poNumber: z.string().optional(),
  additionalParticipants: z.array(AdditionalRegistrationFormSchema).optional()
})

export const EventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  eventSlug: z.string().min(1, { message: 'Slug is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.number().min(0, { message: 'Price must be greater than 0.' }),
  type: z.string().min(1, { message: 'Event type is required.' }).refine((value) => {
    return eventTypes.types.includes(value as EventType)
  }, { message: 'Event type is invalid.' }),
  date: z.date().refine((value) => {
    return value > new Date()
  }, { message: 'Date must be in the future.' }),
  location: z.string().optional(),
  requiredRegistrations: z.number().min(1, { message: 'At least one registration is required.' }),
  language: z.string().min(1, { message: 'Language is required.' }).refine((value) => {
    return i18n.locales.includes(value as Locale)
  }, { message: 'Language is invalid.' }),
  shownLanguages: z.array(z.string().min(1, { message: 'Language is required.' }).refine((value) => {
    return i18n.locales.includes(value as Locale)
  }, { message: 'Language is invalid.' })).min(1, { message: 'At least one language is required.' }),
  stripePriceId: z.string().min(1, { message: 'Stripe price ID is required.' }),
  stripeProductId: z.string().min(1, { message: 'Stripe product ID is required.' })
})

// Exactly the same as EventSchema, but without stripe IDs
export const CreateEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  eventSlug: z.string().min(1, { message: 'Slug is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.number().min(0, { message: 'Price must be greater than 0.' }),
  type: z.string().min(1, { message: 'Event type is required.' }).refine((value) => {
    return eventTypes.types.includes(value as EventType)
  }, { message: 'Event type is invalid.' }),
  date: z.date().refine((value) => {
    return value > new Date()
  }, { message: 'Date must be in the future.' }),
  location: z.string().optional(),
  requiredRegistrations: z.number().min(1, { message: 'At least one registration is required.' }),
  language: z.string().min(1, { message: 'Language is required.' }).refine((value) => {
    return i18n.locales.includes(value as Locale)
  }, { message: 'Language is invalid.' }),
  shownLanguages: z.array(z.string().min(1, { message: 'Language is required.' }).refine((value) => {
    return i18n.locales.includes(value as Locale)
  }, { message: 'Language is invalid.' })).min(1, { message: 'At least one language is required.' }),
})

// ------------------ STORIES/BLOG ---------------------

export const StoryContentSchema = z.object({
  tags: z.array(z.string()).optional(),
  title: z.string().min(1, { message: 'Title is required.' }),
  locale: z.string().min(1, { message: 'Language is required.' }).refine((value) => {
    return i18n.locales.includes(value as Locale)
  }, { message: 'Language is invalid.' }),
  description: z.string().min(1, { message: 'Description is required.' })
})