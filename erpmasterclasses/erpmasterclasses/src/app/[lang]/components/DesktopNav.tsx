

"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ClientHeaderButtonWrapper from '@/app/[lang]/components/admin/ClientHeaderButtonWrapper'
import LocaleSwitchButton from '@/app/[lang]/components/lang/LocaleSwitcher'
import { Locale } from '../../../../i18n.config'

type Route = {
    label: string
    href: string
}

type Navigation = {
    routes: Route[]
    lang: Locale
}

const DesktopNav = ({ routes, lang }: Navigation) => {
    const pathname = usePathname()
    const path = pathname.split('#')[0]

    return (
        <div className='hidden lg:block'>
            <nav className='flex justify-between items-center'>
                <div className='flex items-center space-x-4'>
                    {routes.map((navItem, index) => (
                        <button key={index}>
                            <Link key={index} href={`/${lang}${navItem.href}`} className='px-2'>
                                <span className={`textWithAnimatedUnderline transition-colors text-primary text-md ${path === `/${lang}${navItem.href}` ? 'textWithUnderline' : ''}`} >
                                    {navItem.label}
                                </span>
                            </Link>
                        </button>
                    ))}
                </div>
                <div className='flex items-center gap-4 pr-4'>
                    <ClientHeaderButtonWrapper />
                    <LocaleSwitchButton locale={lang} />
                </div>
            </nav>
        </div>

    )
}

export default DesktopNav
