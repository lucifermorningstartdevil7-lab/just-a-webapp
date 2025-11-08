"use client";
import { motion, useInView, HTMLMotionProps } from "motion/react";
import { useEffect, useRef } from "react";

interface TimelineContentProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  timelineRef: React.RefObject<HTMLDivElement>;
  animationNum: number;
  customVariants?: {
    hidden: any;
    visible: (i: number) => any;
  };
  as?: keyof JSX.IntrinsicElements;
}

const TimelineContent = ({
  children,
  timelineRef,
  animationNum,
  customVariants,
  as = "div",
  ...props
}: TimelineContentProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    root: timelineRef,
    margin: "0px 0px -100px 0px",
    triggerOnce: false,
  });

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      custom={animationNum}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      {...props}
    >
      {children}
    </Component>
  );
};

export { TimelineContent };