import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { Locale } from '@/app/../../i18n.config'
import { JSONContent } from '@tiptap/react'
import { EventProps, CreateEventProps, EventData, RegistrationFormProps, StoryServer } from '@/../typings'
import { Story, StoryContent, StorySummary } from '@/../typings'


// -------------------- DATABASE --------------------

// MongoDB Atlas connection URI
const uri: string | undefined = process.env.MONGODB_URI
if (!uri) throw new Error("The MONGODB_URI environment variable must be defined.")

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

let cachedDb: any = null

// Create a stripe client
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Function to connect to the database
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb
    }

    // Connect the client to the server
    await client.connect()

    const dbName: string | undefined = process.env.MONGODB_DB
    if (!dbName) throw new Error("The MONGODB_DB environment variable must be defined.")

    const db = client.db(dbName)
    cachedDb = db
    return db
}

// -------------------- DATABASE OPERATIONS --------------------


// Get document given id and locale
export async function getParagraphJson(documentId: string, locale: Locale) {
    const db = await connectToDatabase()
    const collection = db.collection('content')
    const result = await collection.findOne({ _id: documentId })

    // Constructing the response to match the original format
    if (result && result.content && result.content[locale]) {
        return {
            _id: result._id as string,
            paragraphJson: result.content[locale] as JSONContent
        }
    }
    
    return null
}

// Get document given id
export type Document = {
    _id: string
    content: {
        [key in Locale]: JSONContent
    }
}
export async function getDocument(documentId: string) {
    const db = await connectToDatabase()
    const collection = db.collection('content')
    const result = await collection.findOne({ _id: documentId }) as Document

    return result
}



// Save paragraph JSON content for a specific locale
export async function saveParagraphJson(documentId: string, locale: Locale, paragraphJson: JSONContent) {
    const db = await connectToDatabase()
    const collection = db.collection('content')

    const filter = { _id: documentId }
    const update = { 
        $set: { [`content.${locale}`]: paragraphJson } 
    }

    const result = await collection.updateOne(filter, update, { upsert: true })

    return result
}


// -------------------- BLOG OPERATIONS --------------------

// incrementStoryViews, to increment the view count of a story
export async function incrementStoryViews(slug: string, lang: Locale) {
    const db = await connectToDatabase()
    const collection = db.collection('stories')

    const filter = { slug }
    const update = { $inc: { [`content.${lang}.views`]: 1 } }

    const result = await collection.updateOne(filter, update)

    return result
}


// getStoryBySlug, to get the full story on the story page
export async function getStoryBySlug(slug: string, lang: Locale): Promise<StoryContent> {
    const db = await connectToDatabase()
    const story: StoryServer = await db.collection('stories').findOne({ slug })
    const storyContent = story && story.content[lang] as StoryContent

    return storyContent
}

// getStory, to get the full story on the story page
export async function getStory(slug: string): Promise<StoryServer> {
    const db = await connectToDatabase()
    const story: StoryServer = await db.collection('stories').findOne({ slug })

    return story
}

// getStories, for overview on the blog page
export async function getStories(lang: Locale): Promise<StorySummary[]> {
    const db = await connectToDatabase()
    const stories: StoryServer[] = await db.collection('stories').find({}).toArray()
    const storySummaries = stories.map(story => {
        return {
            tags: story.content[lang]?.tags,
            slug: story.slug,
            title: story.content[lang]?.title,
            locale: story.content[lang]?.locale,
            description: story.content[lang]?.description,
            date: story.content[lang]?.date,
            views: story.content[lang]?.views
        } as StorySummary
    }) as StorySummary[]

    return storySummaries
}


// getAllStorySlugs, for generating static paths
export async function getAllStorySlugs(): Promise<string[]> {
    const db = await connectToDatabase()
    const stories: StoryServer[] = await db.collection('stories').find({}).toArray()
    const slugs = stories.map(story => story.slug)

    return slugs
}

// updateStory, to update the story in the database (remember to revalidate the path)
export async function updateStory(story: StoryServer) {
    const db = await connectToDatabase()
    const collection = db.collection('stories')

    const { _id, ...storyProps } = story

    const filter = { _id: new ObjectId(_id) }
    const update = { $set: storyProps }

    const result = await collection.updateOne(filter, update)

    return result
}

// addStory, to add a new story to the database (remember to revalidate the path)
export async function addStory(story: Story) {
    const db = await connectToDatabase()
    const collection = db.collection('stories')

    const result = await collection.insertOne(story)

    return result
}

// deleteStory, to delete a story from the database based on the slug (remember to revalidate the path)
export async function deleteStory(slug: string) {
    const db = await connectToDatabase()
    const collection = db.collection('stories')

    const result = await collection.deleteOne({ slug })

    return result
}


// -------------------- EVENT OPERATIONS --------------------

// Get event based on eventSlug and language is in shownLanguages
export async function getEvent(eventSlug: string, language: Locale): Promise<EventProps | null> {
    const db = await connectToDatabase()
    const collection = db.collection('events')
    const result = await collection.findOne({ eventSlug, shownLanguages: language })

    // Constructing the response to match the original format
    if (result) {
        return {
            _id: result._id,
            title: result.title,
            eventSlug: result.eventSlug,
            description: result.description,
            price: result.price,
            type: result.type,
            date: result.date,
            location: result.location,
            requiredRegistrations: result.requiredRegistrations,
            language: result.language,
            shownLanguages: result.shownLanguages,
            stripeProductId: result.stripeProductId,
            stripePriceId: result.stripePriceId
        }
    }

    return null
}


// Get all events based on language is in shownLanguages
export async function getEvents(language: Locale): Promise<EventProps[]> {
    const db = await connectToDatabase()
    const collection = db.collection('events')
    const result = await collection.find({ shownLanguages: language }).toArray()

    // Constructing the response to match the original format
    const events = result.map((event: EventProps) => {
        return {
            _id: event._id.toString(),
            title: event.title,
            eventSlug: event.eventSlug,
            description: event.description,
            price: event.price,
            type: event.type,
            date: event.date,
            location: event.location,
            requiredRegistrations: event.requiredRegistrations,
            language: event.language,
            shownLanguages: event.shownLanguages,
            stripeProductId: event.stripeProductId,
            stripePriceId: event.stripePriceId
        }
    })

    return events
}

// Get all events with registrations (ADMIN)
export async function getEventsWithRegistrations(): Promise<EventData[]> {
    const db = await connectToDatabase()
    const collection = db.collection('events')
    const result = await collection.find({}).toArray()

    // Constructing the response to match the original format
    const events = result.map((event: EventData) => {
        return {
            _id: event._id.toString(),
            title: event.title,
            eventSlug: event.eventSlug,
            description: event.description,
            price: event.price,
            type: event.type,
            date: event.date,
            location: event.location,
            requiredRegistrations: event.requiredRegistrations,
            language: event.language,
            shownLanguages: event.shownLanguages,
            stripeProductId: event.stripeProductId,
            stripePriceId: event.stripePriceId,
            registrations: event.registrations
        }
    }) as EventData[]

    return events
}

// Create new event
export async function addEvent(event: CreateEventProps) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    const _id = new ObjectId()

    const product = await stripe.products.create({
        name: event.title,
        active: true,
        description: event.description,
        metadata: {
            eventId: _id.toString(),
            eventSlug: event.eventSlug,
            date: event.date,
            location: event.location,
            description: event.description,
            type: event.type,
            language: event.language
        },
        tax_code: 'txcd_20030000',
        url: `process.env.NEXT_PUBLIC_URL/${event.language}/agenda/${event.eventSlug}`
    })

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: event.price * 100,
        metadata: {
            eventId: _id.toString()
        },
        currency: 'eur',
    })  

    const eventWithStripe = { ...event, _id, stripeProductId: product.id, stripePriceId: price.id } as EventProps

    const result = await collection.insertOne(eventWithStripe)

    // revalidateTag('events')

    return { result, _id: _id.toString(), eventWithStripe }
}


// Update event
export async function updateEvent(event: EventProps) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    try {
        const { _id, ...eventProps } = event

        // Update price in Stripe (make a new one)
        const updatedPrice = await stripe.prices.create({
            product: event.stripeProductId,
            unit_amount: event.price * 100,
            metadata: {
                eventId: event._id.toString()
            },
            currency: 'eur',
        })

        // Update product in Stripe
        try {
            await stripe.products.update(event.stripeProductId, { 
                name: event.title, 
                description: event.description, 
                // url: `process.env.NEXT_PUBLIC_URL/${event.language}/agenda/${event.eventSlug}` 
            })    
        } catch (error) {
            console.error('Error updating Stripe product:', error)
            throw error // Rethrow or handle it as needed
        }

        // Set the old price to inactive
        try {
            await stripe.prices.update(event.stripePriceId, { active: false })
        } catch (error) {
            console.error('Error updating Stripe price:', error)
        }

        // Set the new price to the event object
        const stripePriceId =  updatedPrice.id as string
        eventProps.stripePriceId = stripePriceId

        // Update the event in the database
        const filter = { _id: new ObjectId(_id) }
        const update = { $set: eventProps }
        const result = await collection.updateOne(filter, update) as { matchedCount: number, modifiedCount: number, acknowledged: boolean, upsertedId: ObjectId | null, upsertedCount: number }

        return { result, stripePriceId }
    } catch (error) {
        console.error('Error updating event:', error)
        throw error // Rethrow or handle it as needed
    }    
}

// Delete event
export async function deleteEvent(eventId: string) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    let stripeProdId
    let result

    console.log('Deleting event:', eventId)

    // Get event from database
    try {
        const event = await collection.findOne({ _id: new ObjectId(eventId) })
        stripeProdId = event?.stripeProductId
    } catch (error) {
        console.error('Error fetching event from database:', error)
        throw error // Rethrow or handle it as needed
    }

    // Delete the event from the database
    try {
        result = await collection.deleteOne({ _id: new ObjectId(eventId) })
    } catch (error) {
        console.error('Error deleting event from database:', error)
        throw error // Rethrow or handle it as needed
    }

    // Attempt to delete Stripe product
    try {
        await stripe.products.del(stripeProdId)
    } catch (error) {
        console.error('Cant delete Stripe product, setting it to inactive')
    }

    // Attempt to update Stripe price
    try {
        await stripe.products.update(stripeProdId, { active: false })
        console.log('Stripe product set to inactive:', stripeProdId)
    } catch (error) {
        console.error('Error updating Stripe price:', error)    }

    return result
}

// Add registration to event
export async function addRegistration(registration: RegistrationFormProps) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    const eventId = registration.selectedEvent._id

    const filter = { _id: new ObjectId(eventId) }
    const update = { $push: { registrations: registration } }

    const result = await collection.updateOne(filter, update)

    // TODO Send confirmation email
    return result
}

// Delete registration from event
export async function deleteRegistration(eventId: string, registrationId: string) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    const filter = { _id: new ObjectId(eventId) }
    const update = { $pull: { registrations: { _id: registrationId } } }

    const result = await collection.updateOne(filter, update)

    // TODO Send cancellation email

    return result
}

// Update registration from event
export async function updateRegistration(eventId: string, registration: RegistrationFormProps) {
    const db = await connectToDatabase()
    const collection = db.collection('events')

    const filter = { _id: new ObjectId(eventId), "registrations._id": new ObjectId(registration._id) }
    const update = { $set: { "registrations.$": registration } }

    const result = await collection.updateOne(filter, update)

    return result
}





// --------------- CACHING AND SERVER-SIDE PROPS ---------------

// const storyCache = new NodeCache({ stdTTL: 3600 }) // Cache for 1 hour

// function getEnvVar(key: string): string {
//     const value = process.env[key]
//     if (!value) {
//         throw new Error(`Environment variable ${key} is not set.`)
//     }
//     return value
// }

// const STORY_VIEW_THRESHOLD = getEnvVar('STORY_VIEW_THRESHOLD') as unknown as number

// async function getStoryBySlug(slug: string, lang: Locale): Promise<StoryContent> {
//     // Try to get the story from the cache first
//     const cachedStory: Story = storyCache.get(slug) as Story
//     const cachedStoryContent = cachedStory && cachedStory[lang] as StoryContent
//     if (cachedStory) {
//       return cachedStoryContent
//     }
  
//     // If the story is not in the cache, get it from the database
//     const db = await connectToDatabase()
//     const story: Story = await db.collection('stories').findOne({ [`${lang}.slug`]: slug })
//     const storyContent = story && story[lang] as StoryContent
    
//     // If the story has a high view count, cache it
//     if (story && storyContent.views > STORY_VIEW_THRESHOLD) {
//       storyCache.set(slug, story)
//     }
  
//     return storyContent
//   }
  

  
// export default {
//     updateStory,
//     addStory,
//     getStories,
//     getAllStorySlugs,
//     getStoryBySlug,
// }

