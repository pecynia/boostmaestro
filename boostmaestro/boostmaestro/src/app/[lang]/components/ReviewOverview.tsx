"use client"

import React, { useEffect, useState, useRef } from 'react'
import EditorWrapper from '@/app/[lang]/components/editor/EditorWrapper'
import { Locale } from '@../../../i18n.config'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from '@studio-freight/lenis'

type ReviewProps = {
  title: string
  subTitle: string
  description: string
  beOurNextSuccessStory: string
  rating: string
}

const ReviewOverview: React.FC<{ lang: Locale, review: ReviewProps }> = ({ lang, review }) => {
    const documentIds = [
        'review-description-1',
        'review-description-2',
        'review-description-3',
        'review-description-4',
        'additional-description-1',
        'review-description-5',
        'review-description-6',	
    ]
    
    // For keeping track of scroll position
    const container = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ["start end", "end start"],
    })    

    // Text animation
    const disappearRight = useTransform(scrollYProgress, [0, 0.2], ['0%', '-30%'])

    // For adding smooth scroll
    const [dimension, setDimension] = useState({ width: 0, height: 0 })
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
      <motion.div layout
        className='bg-white relative border-2 border-white' 
        ref={container}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -dimension.height * 0.35]) }} 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
      >
        <motion.div layout className='container px-4 mx-auto'>
            {/* Descriptive Div for large screen*/}
            <motion.div
                className="hidden lg:block mt-20 ml-auto text-left w-2/3 flex-col items-center justify-center"
                style={{ x: disappearRight }}
            >
              <h1 className='text-3xl text-secondary font-bold'>
                {review.description}
              </h1>
            </motion.div>

            {/* Descriptive Div for small screen*/}
            <motion.div className="block lg:hidden mt-10 w-full flex-col items-center justify-center">
              <h1 className='text-3xl text-secondary font-bold'>
                {review.description}
              </h1>
            </motion.div>

            {/* Overview */}
            <div className="-mt-5 w-full md:w-3/4 lg:w-4/5 mx-auto px-16 overflow-hidden">
                {documentIds.map((documentId, index) => (
                    <motion.div layout
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                        className={`flex items-center max-w-5xl w-full md:w-4/5 lg:2/3 px-4 my-16 md:my-24 bg-background ${index % 2 === 0 ? 'shadow-right-secondary ml-auto' : 'shadow-left-secondary mr-auto'}`}
                    >
                        <EditorWrapper documentId={documentId} initialLocale={lang} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </motion.div>
    )
}

export default ReviewOverview