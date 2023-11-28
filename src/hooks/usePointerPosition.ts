import { useEffect, useState } from 'react';
import { ElementPosition, Point } from '../types/types';

type UsePointerPositionProp = {
  containerRef?: React.RefObject<Element>;
  rect?: ElementPosition | null;
};

/**
 * Custom hook to track the mouse pointer's position relative to a specified container.
 */
export const usePointerPosition = ({
  containerRef,
  rect: _rect,
}: UsePointerPositionProp): Point => {
  // State to store the current pointer position.
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const rect = containerRef?.current?.getBoundingClientRect() ?? _rect;

    if (!rect) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [_rect]);

  return position;
};
