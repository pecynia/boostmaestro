"use client"

import React, { useEffect, useState, useRef } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Locale } from '@../../../i18n.config'
import { Button } from '@/app/[lang]/components/ui/button'
import Groep1 from '@/../public/imgs/groep-1.jpg'
import Spokeperson2 from '@/../public/imgs/spokeperson2.jpg'
import Lenis from '@studio-freight/lenis'


const HomeTopSection: React.FC<{ lang: Locale }> = ({ lang }) => {
    
    // Make smooth Lenis animations
    const [dimension, setDimension] = useState({ width: 0, height: 0 })
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            smoothTouch: true,
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

    // For keeping track of scroll position
    const container = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    })   

    return (
        <div className="relative text-primary-foreground flex flex-col justify-center items-start h-[80vh]">
            <motion.div  
                ref={container}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, dimension.height * 0.2]) }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className='absolute -mt-36 top-0 left-0 w-full h-full flex justify-center items-center'
            >
                <Image 
                    src={Groep1}
                    alt="Image" 
                    fill
                    className="object-cover object-center -scale-x-100 "
                    style={{ objectPosition: 'center 15%' }}
                />  
            </motion.div>
                    
        
            {/* Content Section */}
            <motion.div layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className=" relative left-[10vw] bg-white text-primary rounded-md w-4/5 md:w-3/5 lg:w-2/5 pt-2 "
            >
                <div className="w-full my-12 px-14">
                    <h1 className='text-2xl lg:text-4xl font-bold text-primary mb-4'>
                        ERP Masterclasses
                    </h1>
                    <p className="text-xl">
                        Transform your business with Guus Krabbenborg.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default HomeTopSection
