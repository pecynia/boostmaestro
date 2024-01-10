"use client"

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import EditorWrapper from '@/app/[lang]/components/editor/EditorWrapper';
import { Locale } from '../../../../i18n.config';
import Image from 'next/image';
import UitlegIntens from '@/../public/imgs/uitleg-intens.jpeg';

const StickyScroll = ({ lang }: { lang: Locale }) => {
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const { scrollYProgress } = useScroll();

    const appearLeft = useTransform(scrollYProgress, [0, 0.25], ['-100%', '0%']);
    const disappearRight = useTransform(scrollYProgress, [0, 0.2], ['0%', '-20%']);

    const textIds = ['sticky-text-1', 'sticky-text-2', 'sticky-text-3', 'sticky-text-4', 'sticky-text-5'];

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            smoothTouch: true,
            normalizeWheel: true,
        });

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        const resize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', resize);
        requestAnimationFrame(raf);
        resize();

        return () => {
            lenis.destroy();
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="container mx-auto px-4">
            {/* Descriptive Div */}
            <motion.div 
                className="ml-auto text-left w-2/3 mb-56 pt-10 h-42 flex flex-col items-center justify-center"
                style={{ x: disappearRight }}
            >

                <EditorWrapper documentId={'about-description'} initialLocale={lang}/>
            </motion.div>

            {/* Main Content */}
            <div className="pt-10 flex justify-between items-start gap-8">
                {/* Left Column */}
                <motion.div 
                    className="sticky top-[50vh] self-start w-1/3 h-96 flex flex-col items-center justify-center"
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
                            objectPosition='center 20%'
                        />
                    </motion.div>
                </motion.div>

                {/* Right Column, center children on x-axis */}
                <div className="flex-1 gap-36 pb-36 overflow-visible text-xl -mt-32 flex flex-col items-center justify-center">
                    {textIds.map((item) => (
                        <motion.div layout
                            key={item} 
                            className="shadow-left-secondary p-2 h-40 mb-4 rounded-xl w-2/3"
                            initial={{ opacity: 0, x: '100%' }}
                            whileInView={{ opacity: 1, x: '0%' }}
                            // viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                        >
                            <EditorWrapper documentId={item} initialLocale={lang}/>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StickyScroll;