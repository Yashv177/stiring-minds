'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  speed?: number;
  onClick?: () => void;
}

export function TiltCard({
  children,
  className,
  intensity = 10,
  speed = 500,
  onClick
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animations for fluid movement
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform mouse position to rotation angles
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position as normalized coordinates (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  // Reset position on mouse leave
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glossy highlight overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-xl pointer-events-none"
        style={{
          transform: 'translateZ(1px)',
          opacity: useTransform(
            xSpring,
            [-0.5, 0.5],
            [0, 1]
          )
        }}
      />
      
      {/* Main content */}
      <div
        className="relative h-full"
        style={{ transform: 'translateZ(0px)' }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Simpler version for smaller cards with less intensity
interface TiltCardSmallProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltCardSmall({
  children,
  className,
  onClick
}: TiltCardSmallProps) {
  return (
    <TiltCard
      className={className}
      intensity={6}
      speed={300}
      onClick={onClick}
    >
      {children}
    </TiltCard>
  );
}

