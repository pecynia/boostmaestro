import React from 'react'
import ClientContactForm from '@/app/[lang]/components/ClientContactForm'
import { Locale } from '@../../../i18n.config'
import { getDictionary } from '@/lib/dictionary'


export default async function Page({
  params: { lang }
}: {
  params: { lang: Locale }
}) { 

  const { contact, errorMessages } = await getDictionary(lang);

  return (
    <div className='flex flex-col items-center justify-center w-full py-20 relative'>
        <ClientContactForm localization={contact} errorMessages={errorMessages} />
    </div>
  )
}