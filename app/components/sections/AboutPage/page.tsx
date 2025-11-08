"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import HomeHeader from "../header";
import { TimelineContent } from "./timeline-animation";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  return (
    <div className="dark:bg-black bg-white">
      <HomeHeader />
      <section className="py-32 px-4 min-h-screen dark:bg-black bg-white">
        <div className="max-w-4xl mx-auto" ref={containerRef}>
          <div className="flex flex-col items-center text-center gap-8">
            <TimelineContent
              as="h1"
              animationNum={0}
              timelineRef={containerRef}
              customVariants={revealVariants}
              className="text-4xl md:text-5xl !leading-[110%] font-semibold text-gray-900 dark:text-white mb-4"
            >
              From a Spark of Curiosity to a Sprout of Innovation
            </TimelineContent>

            <TimelineContent
              as="p"
              animationNum={1}
              timelineRef={containerRef}
              customVariants={revealVariants}
              className="sm:text-lg text-base text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              ClickSprout was born from a simple passion: a love for building
              impactful web projects. As a student navigating the exciting world
              of software development, I saw a need for a smarter, more
              intuitive way for creators to share their content and grow their
              audience.
            </TimelineContent>

            <TimelineContent
              as="p"
              animationNum={2}
              timelineRef={containerRef}
              customVariants={revealVariants}
              className="sm:text-lg text-base text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              This project is more than just code; it's a journey of learning,
              experimenting, and creating. It's built for fellow creators,
              marketers, and anyone looking to maximize their online presence
              with minimal effort. Thank you for being a part of this journey.
            </TimelineContent>
          </div>
        </div>
      </section>
    </div>
  );
}