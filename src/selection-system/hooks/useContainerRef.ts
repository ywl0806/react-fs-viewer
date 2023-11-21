import { useRef, useEffect } from 'react';
import { useContext } from 'react';
import { DragSelectionContext } from '../context/SelectionContext';

export const useContainerRect = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { setContainerRect } = useContext(DragSelectionContext);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();

      setContainerRect({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        right: rect.left + window.scrollX + rect.width,
        bottom: rect.top + window.scrollY + rect.height,
      });
    }
  }, [ref, setContainerRect]);

  return ref;
};
