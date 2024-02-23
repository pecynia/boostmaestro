"use client"

import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import EditorWrapper from '@/app/[lang]/components/editor/EditorWrapper'
import { Locale } from '@../../../i18n.config'
import Image from 'next/image'
import UitlegIntens from '@/../public/imgs/uitleg-intens.jpeg'
import { Presentation, Users, BookOpenText, Mic2, Network } from 'lucide-react'

const AboutOverview = ({ lang }: { lang: Locale }) => {
    const [dimension, setDimension] = useState({ width: 0, height: 0 })
    const { scrollYProgress } = useScroll()

    const appearLeft = useTransform(scrollYProgress, [0, 0.25], ['-100%', '0%'])
    const disappearRight = useTransform(scrollYProgress, [0, 0.2], ['0%', '-20%'])

    const textIds = ['sticky-text-1', 'sticky-text-4', 'sticky-text-5']
    const icons = [
        <Network size={36} key="network" />, 
        // <Presentation size={36} key="presentation" />, 
        // <Users size={36} key="users" />, 
        <BookOpenText size={36} key="book-open-text" />, 
        <Mic2 size={36} key="mic2" />
    ]

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            // smoothTouch: true,
            normalizeWheel: true,
        })

        const raf = (time: number) => {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        const resize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight })
        }

        window.addEventListener('resize', resize)
        requestAnimationFrame(raf)
        resize()

        return () => {
            lenis.destroy()
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div className="container mx-auto px-4">
            {/* Descriptive Div */}
            <motion.div 
                className="ml-auto text-left w-4/5 lg:w-2/3 mb-44 lg:mb-56 pt-0 lg:pt-10 h-42 flex flex-col items-center justify-center"
                style={{ x: disappearRight }}
            >
                <EditorWrapper documentId={'about-description'} initialLocale={lang}/>
            </motion.div>

            {/* Main Content */}
            <div className="pt-10 flex justify-between items-start gap-8 bg-background rounded-t-3xl">
                {/* Left Column */}
                <motion.div 
                    className="sticky top-[50vh] self-start w-1/5 lg:w-1/3 h-96 flex flex-col items-center justify-center"
                    style={{ transform: 'translateY(-50%)' }} 
                >
                    {/* Image in a circle  */}
                    <motion.div 
                        className="relative w-96 h-96 rounded-full overflow-hidden"
                    >
                        <Image
                            src={UitlegIntens}
                            alt="About Image"
                            fill
                            className='object-cover w-full h-full'
                            style={{ objectPosition: 'center 20%' }}
                        />
                    </motion.div>
                </motion.div>

                {/* Right Column, center children on x-axis, flies in from right */}
                <motion.div layout
                    className="z-10 flex-1 gap-36 pb-36 overflow-hidden pt-20 -mt-48 flex flex-col items-center justify-center"
                >
                    {textIds.map((item, index) => (
                        <motion.div key={index} 
                            className="shadow-left-secondary bg-white p-4 h-full mb-4 ml-4 rounded-xl w-full lg:w-2/3"
                            // initial={{ opacity: 0, x: 300 }}
                            // whileInView={{ opacity: 1, x: 0 }}
                            // viewport={{ once: false }}
                            // transition={{ duration: 0.7, delay: 0, ease: [0, 0.71, 0.2, 1.01] }}
                        >
                            <div className="ml-8 mt-4 -mb-2 flex items-center text-secondary">
                                {icons[index]}
                            </div>
                            <EditorWrapper documentId={item} initialLocale={lang} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default AboutOverview
