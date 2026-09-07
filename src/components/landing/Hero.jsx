import React from 'react'
import { motion } from 'framer-motion'
import HeroScan from './HeroScan'

const ease = [0.22, 1, 0.36, 1]

const Hero = () => (
  <section id="top" className="relative h-screen min-h-[640px] overflow-hidden">
    <HeroScan />

    <div className="relative z-10 h-full flex flex-col justify-center pt-[26vh] md:pt-0 md:justify-end px-6 md:px-8 pb-[8vh] md:pb-[9vh]">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        className="display md:whitespace-nowrap"
        style={{ fontSize: 'clamp(30px, 4.4vw, 66px)' }}
      >
        We make interactions intelligent.
      </motion.h1>

    </div>

    <motion.a
      href="#core"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="absolute z-10 right-6 md:right-8 bottom-[10vh] md:bottom-[12vh] text-[13px] font-medium hover:opacity-60 transition-opacity"
    >
      Explore{' '}
      <motion.span
        aria-hidden
        className="inline-block"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↓
      </motion.span>
    </motion.a>
  </section>
)

export default Hero
