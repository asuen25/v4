/**
 * https://www.joshwcomeau.com/snippets/react-hooks/use-prefers-reduced-motion/
 */

import { useState, useEffect } from 'react';
const QUERY = '(prefers-reduced-motion: no-preference)';
const isRenderingOnServer = typeof window === 'undefined';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    // Set the actual value on the client after hydration
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(!mediaQueryList.matches);

    const listener = event => {
      setPrefersReducedMotion(!event.matches);
    };

    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(listener);
    } else {
      mediaQueryList.addEventListener('change', listener);
    }

    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(listener);
      } else {
        mediaQueryList.removeEventListener('change', listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
