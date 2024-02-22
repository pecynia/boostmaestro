import { Locale } from '@/app/../../i18n.config'

type StoryContent = {
    tags: string | string[] | null | undefined
    slug: string
    title: string
    description: string
    content: string
    date: string
    views: number
}


export interface AdditionalRegistrationFormProps {
    nameParticipant: string
    email: string
    phone: string
    position: string
}

export interface RegistrationFormProps {
    _id: ObjectId
    eventTitel: string
    eventDate: Date
    lang: Locale
    companyName: string
    companyWebsite: string
    address: string
    country: string
    nameParticipant: string
    phone: string
    email: string
    position: string
    vatNumber: string
    poNumber?: string
    additionalParticipants?: AdditionalRegistrationFormProps[]
    selectedEvent: EventProps
}    

// ------------------ EVENTS ------------------

// Event properties for client-side
export type CreateEventProps = {
    title: string
    eventSlug: string
    description: string
    price: number
    type: EventType
    date: Date
    location?: string
    requiredRegistrations: number
    language: Locale
    shownLanguages: Locale[]
}

// Event properties for client-side
export type EventProps = {
    _id: ObjectId
    title: string
    eventSlug: string
    description: string
    price: number
    type: EventType
    date: Date
    location?: string
    requiredRegistrations: number
    language: Locale
    shownLanguages: Locale[]
    stripeProductId: string
    stripePriceId: string
}

// Event properties for server-side
export type EventData = {
    _id: string // the id of the event, same as EventProps._id
    title: string
    eventSlug: string
    description: string
    price: number
    type: EventType
    date: Date
    location?: string
    requiredRegistrations: number
    language: Locale
    shownLanguages: Locale[]
    stripeProductId: string
    stripePriceId: string
    registrations: RegistrationFormProps[]
}


// ------------------ PRODUCTS ------------------

export type ProductResponse = {
    id: string
    object: string
    active: boolean
    created: number
    default_price: number
    description: string
    images: string[]
    livemode: boolean
    metadata: {}
    name: string
    package_dimensions: {}
    shippable: boolean
    statement_descriptor: string
    tax_code: string
    unit_label: string
    updated: number
    url: string
}