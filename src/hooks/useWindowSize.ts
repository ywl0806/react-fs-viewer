import { useLayoutEffect, useState } from 'react';

/**
 * Custom hook to get the current window size.
 * This hook listens for window resize events and updates the size state accordingly.
 *
 * @returns {number[]} An array containing the current width and height of the window.
 * [`window.innerWidth`,`window.innerHeight`]
 */
export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
