import { useEffect, useState } from 'react';

export default function useMediaQuery() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop' | null>(
    null
  );
  const [breakpoint, setBreakpoint] = useState<{
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    is2xl: boolean;
  } | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setDevice('mobile');
      } else if (
        window.matchMedia('(min-width: 641px) and (max-width: 1024px)').matches
      ) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }

      const calcBreakPoint = () => {
        return {
          isSm: window.matchMedia('(min-width: 640px)').matches,
          isMd: window.matchMedia('(min-width: 768px)').matches,
          isLg: window.matchMedia('(min-width: 1024px)').matches,
          isXl: window.matchMedia('(min-width: 1280px)').matches,
          is2xl: window.matchMedia('(min-width: 1536px)').matches,
        };
      };

      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });
      setBreakpoint(calcBreakPoint());
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const width = dimensions?.width || 0;
  const height = dimensions?.height || 0;

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    vh: (percentage: number) => {
      return (percentage * height) / 100;
    },
    vw: (percentage: number) => {
      return (percentage * width) / 100;
    },
    vMin: (percentage: number) => {
      const min = Math.min(width, height);
      return (percentage * min) / 100;
    },
    vMax: (percentage: number) => {
      const max = Math.max(width, height);
      return (percentage * max) / 100;
    },
    maxPx: (px: number, minPx: number) => {
      return Math.max(px, minPx);
    },
    minPx: (px: number, maxPx: number) => {
      return Math.min(px, maxPx);
    },
    clampPx: (minPx: number, px: number, maxPx: number) => {
      return Math.min(Math.max(px, minPx), maxPx);
    },
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isSm: breakpoint?.isSm,
    isMd: breakpoint?.isMd,
    isLg: breakpoint?.isLg,
    isXl: breakpoint?.isXl,
    is2xl: breakpoint?.is2xl,
  };
}
