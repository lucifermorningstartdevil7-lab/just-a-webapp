'use client'
import React, { useEffect, useRef, useCallback, useMemo } from 'react';

interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  username: string;
  className?: string;
  enableTilt?: boolean;
}

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  username,
  className = '',
  enableTilt = true
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 3.5))}deg`,
        '--rotate-y': `${round(centerY / 3.5)}deg`
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.style.setProperty('--card-opacity', '1');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(600, event.offsetX, event.offsetY, card, wrap);
      wrap.style.setProperty('--card-opacity', '0');
    },
    [animationHandlers]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    // Initialize CSS variables on mount to avoid hydration mismatch
    wrap.style.setProperty('--pointer-x', '50%');
    wrap.style.setProperty('--pointer-y', '50%');
    wrap.style.setProperty('--pointer-from-center', '0');
    wrap.style.setProperty('--pointer-from-top', '0.5');
    wrap.style.setProperty('--pointer-from-left', '0.5');
    wrap.style.setProperty('--card-opacity', '0');
    wrap.style.setProperty('--rotate-x', '0deg');
    wrap.style.setProperty('--rotate-y', '0deg');

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;

    card.addEventListener('pointerenter', pointerEnterHandler);
    card.addEventListener('pointermove', pointerMoveHandler);
    card.addEventListener('pointerleave', pointerLeaveHandler);

    const initialX = wrap.clientWidth / 2;
    const initialY = wrap.clientHeight / 2;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);

    return () => {
      card.removeEventListener('pointerenter', pointerEnterHandler);
      card.removeEventListener('pointermove', pointerMoveHandler);
      card.removeEventListener('pointerleave', pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [enableTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  return (
    <div 
      ref={wrapRef} 
      className={`relative ${className}`.trim()}
      style={{
        perspective: '1000px',
        '--pointer-x': '50%',
        '--pointer-y': '50%',
        '--pointer-from-center': '0',
        '--pointer-from-top': '0.5',
        '--pointer-from-left': '0.5',
        '--card-opacity': '0',
        '--rotate-x': '0deg',
        '--rotate-y': '0deg'
      } as React.CSSProperties}
    >
      {/* Animated Background Glow */}
      <div 
        className="absolute -inset-8 rounded-[32px] opacity-0 transition-opacity duration-500 blur-3xl"
        style={{
          background: `
            radial-gradient(circle at var(--pointer-x) var(--pointer-y), 
              rgba(168, 85, 247, calc(var(--card-opacity) * 0.4)) 0%,
              rgba(59, 130, 246, calc(var(--card-opacity) * 0.3)) 25%,
              rgba(16, 185, 129, calc(var(--card-opacity) * 0.2)) 50%,
              transparent 80%
            )
          `,
          opacity: 'var(--card-opacity)'
        }}
      />
      
      {/* Main Card */}
      <div 
        ref={cardRef}
        className="relative w-full aspect-[0.7] max-w-sm mx-auto rounded-[32px] overflow-hidden cursor-pointer
                   transition-transform duration-200 ease-out"
        style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: `
            0 20px 60px -15px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `,
          transform: `
            perspective(1000px)
            rotateX(var(--rotate-y))
            rotateY(var(--rotate-x))
            translateZ(0)
          `
        }}
      >
        {/* Gradient Overlay on Hover */}
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at var(--pointer-x) var(--pointer-y),
                rgba(168, 85, 247, 0.15) 0%,
                rgba(59, 130, 246, 0.1) 30%,
                transparent 60%
              )
            `,
            opacity: 'calc(var(--card-opacity) * 0.8)'
          }}
        />

        {/* Shine Effect */}
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                135deg,
                transparent 0%,
                rgba(255, 255, 255, 0.03) calc(var(--pointer-x) - 20%),
                rgba(255, 255, 255, 0.08) var(--pointer-x),
                rgba(255, 255, 255, 0.03) calc(var(--pointer-x) + 20%),
                transparent 100%
              )
            `,
            opacity: 'var(--card-opacity)'
          }}
        />

        {/* Content Container */}
        <div className="relative w-full h-full flex flex-col">
          {/* Avatar Section - Takes most space */}
          <div className="flex-1 flex items-end justify-center px-8 pt-12 pb-6">
            <div className="relative w-full max-w-[280px]">
              {/* Glow behind avatar */}
              <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                  transform: 'scale(1.2)'
                }}
              />
              
              {/* Avatar Image */}
              <img
                src={avatarUrl}
                alt={name}
                className="relative w-full h-auto aspect-square object-cover rounded-full
                         border-2 border-white/10 shadow-2xl"
                style={{
                  transform: `translateZ(20px)`,
                  filter: 'brightness(1.05) contrast(1.05)'
                }}
                loading="lazy"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=6366f1&color=fff`;
                }}
              />
            </div>
          </div>

          {/* Info Section - Bottom */}
          <div className="px-8 pb-8">
            <div 
              className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10
                         shadow-lg"
              style={{
                transform: 'translateZ(30px)'
              }}
            >
              {/* Centered User Info */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <h2 className="text-xl font-bold text-white truncate max-w-full">
                  {name}
                </h2>
                <p className="text-sm text-white/60 truncate max-w-full">
                  @{username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileCardComponent);