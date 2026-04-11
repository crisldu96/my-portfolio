import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface FadeInProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
}

function FadeInWhenVisible({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 36,
}: FadeInProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const hidden: Record<string, number> = { opacity: 0 };
  if (!prefersReduced) {
    if (direction === 'up') hidden.y = distance;
    else if (direction === 'down') hidden.y = -distance;
    else if (direction === 'left') hidden.x = distance;
    else if (direction === 'right') hidden.x = -distance;
  }

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden,
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            duration: prefersReduced ? 0 : duration,
            delay: prefersReduced ? 0 : delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default FadeInWhenVisible;
