import React from 'react'
import ClientRegistrationForm from '@/app/[lang]/components/ClientRegistrationForm'
import { Locale } from '@../../../i18n.config'
import { getDictionary } from '@/lib/dictionary'
import { getEvents } from '@/lib/utils/db'
import Image from 'next/image'
import Groep3 from '@/../public/imgs/groep-3.jpg'

export default async function Page({
  params: { lang, eventSlug }
}: {
  params: { lang: Locale, eventSlug: string }
}) {

  const events = await getEvents(lang)
  const event = events.find(event => event.eventSlug === eventSlug)
  const { contact, errorMessages } = await getDictionary(lang)

  return (
    <div className='flex flex-col items-center justify-center w-full py-10 relative overflow-hidden'>
      <Image
        src={Groep3}
        alt="Image"
        fill
        className="object-cover object-center blur-sm scale-105 "
        style={{ objectPosition: 'center 15%' }}
      />
      <ClientRegistrationForm selectedEvent={event} events={events} lang={lang} localization={contact} errorMessages={errorMessages} />
    </div>
  )
}