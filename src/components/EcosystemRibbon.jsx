import React from 'react'

// Import icons directly to guarantee Vite resolves them
import reactIcon from '../assets/icons/React.png'
import nextjsIcon from '../assets/icons/nextjs.png'
import vueIcon from '../assets/icons/vue.png'
import angularIcon from '../assets/icons/angualr.png'
import svelteIcon from '../assets/icons/svelte.png'
import typescriptIcon from '../assets/icons/Typescript.png'
import javascriptIcon from '../assets/icons/Javascript.png'
import pythonIcon from '../assets/icons/python.png'
import rustIcon from '../assets/icons/rust.png'
import goIcon from '../assets/icons/go.png'
import javaIcon from '../assets/icons/Java.png'
import tailwindIcon from '../assets/icons/tailwind.png'
import viteIcon from '../assets/icons/vite.png'
import npmIcon from '../assets/icons/npm.png'
import dockerIcon from '../assets/icons/docker.webp'
import firebaseIcon from '../assets/icons/firebase.png'
import supabaseIcon from '../assets/icons/supabase.png'
import prismaIcon from '../assets/icons/prisma.png'
import graphqlIcon from '../assets/icons/graphql.png'
import reduxIcon from '../assets/icons/redux.png'
import nodejsIcon from '../assets/icons/Node.js.png'
import flutterIcon from '../assets/icons/Flutter.png'
import astroIcon from '../assets/icons/astro.png'
import postgresqlIcon from '../assets/icons/PostgresSQL.png'
import mongodbIcon from '../assets/icons/MongoDB.png'
import awsIcon from '../assets/icons/aws.png'
import vercelIcon from '../assets/icons/vercel.webp'
import kotlinIcon from '../assets/icons/kotlin.png'
import swiftIcon from '../assets/icons/swift.png'
import expressIcon from '../assets/icons/express.png'
import eslintIcon from '../assets/icons/eslint.png'
import prettierIcon from '../assets/icons/prettier.png'
import zodIcon from '../assets/icons/zod.png'
import axiosIcon from '../assets/icons/axios.png'
import gsapIcon from '../assets/icons/gsap.png'
import framermotionIcon from '../assets/icons/framer-motion.png'
import tauriIcon from '../assets/icons/tauri.png'
import bunIcon from '../assets/icons/bun.png'
import yarnIcon from '../assets/icons/Yarn.png'

const logos = [
  { name: 'React', image: reactIcon },
  { name: 'Next.js', image: nextjsIcon, className: 'invert' },
  { name: 'Vue', image: vueIcon, className: 'scale-110' },
  { name: 'Angular', image: angularIcon, className: 'scale-125' },
  { name: 'Svelte', image: svelteIcon, className: 'scale-125' },
  { name: 'TypeScript', image: typescriptIcon, className: 'scale-110' },
  { name: 'JavaScript', image: javascriptIcon, className: 'scale-110' },
  { name: 'Python', image: pythonIcon },
  { name: 'Rust', image: rustIcon, className: 'invert scale-125' },
  { name: 'Go', image: goIcon, className: 'scale-150' },
  { name: 'Java', image: javaIcon, className: 'scale-125' },
  { name: 'Tailwind', image: tailwindIcon },
  { name: 'Vite', image: viteIcon, className: 'scale-110' },
  { name: 'npm', image: npmIcon, className: 'scale-125' },
  { name: 'Docker', image: dockerIcon, className: 'scale-125' },
  { name: 'Firebase', image: firebaseIcon },
  { name: 'Supabase', image: supabaseIcon },
  { name: 'Prisma', image: prismaIcon, className: 'invert' },
  { name: 'GraphQL', image: graphqlIcon },
  { name: 'Redux', image: reduxIcon, className: 'scale-110' },
  { name: 'Node.js', image: nodejsIcon, className: 'scale-110' },
  { name: 'Flutter', image: flutterIcon },
  { name: 'Astro', image: astroIcon, className: 'invert' },
  { name: 'PostgreSQL', image: postgresqlIcon },
  { name: 'MongoDB', image: mongodbIcon, className: 'scale-125' },
  { name: 'AWS', image: awsIcon, className: 'scale-125' },
  { name: 'Vercel', image: vercelIcon, className: 'invert' },
  { name: 'Kotlin', image: kotlinIcon, className: 'scale-125' },
  { name: 'Swift', image: swiftIcon, className: 'scale-125' },
  { name: 'Express', image: expressIcon, className: 'invert scale-125' },
  { name: 'ESLint', image: eslintIcon, className: 'scale-125' },
  { name: 'Prettier', image: prettierIcon, className: 'scale-125' },
  { name: 'Zod', image: zodIcon, className: 'scale-125' },
  { name: 'Axios', image: axiosIcon, className: 'scale-125' },
  { name: 'GSAP', image: gsapIcon, className: 'scale-125' },
  { name: 'Framer Motion', image: framermotionIcon, className: 'invert' },
  { name: 'Tauri', image: tauriIcon, className: 'scale-125' },
  { name: 'Bun', image: bunIcon, className: 'invert scale-125' },
  { name: 'Yarn', image: yarnIcon, className: 'scale-125' },
]

export default function EcosystemRibbon() {
  return (
    <section className="py-12 border-b border-white/5 bg-[#09090b] overflow-hidden">
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Supports your entire stack</p>
      </div>

      <div className="relative flex max-w-[100vw] overflow-hidden group py-4">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#09090b] to-transparent"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#09090b] to-transparent"></div>

        <div
          className="flex flex-nowrap items-center gap-16 md:gap-24 pl-8 md:pl-16 animate-marquee hover:[animation-play-state:paused] w-max"
        >
          {/* Double the logos for seamless looping */}
          {[...logos, ...logos].map((tech, index) => (
            <div
              key={index}
              className="flex items-center justify-center cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:scale-110 shrink-0"
              title={tech.name}
            >
              <img
                src={tech.image}
                alt={tech.name}
                className={`h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${tech.className || ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
