import React from 'react'
import HeroSection from './sections/HeroSection'
import FTASection from './sections/FTASection'
import { FeaturedCoursesSection } from './sections/FeaturedCoursesSection'
import { TestimonialsSection } from './sections/TestimonalSection'
import { NewsletterSection } from './sections/NewsletterSection'

export const HomepageModule = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedCoursesSection />
      <TestimonialsSection />
      <FTASection />
      <NewsletterSection />
    </main>
  )
}

