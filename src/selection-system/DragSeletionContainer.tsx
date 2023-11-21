import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as React from 'react';
import { useContainerRect } from './hooks/useContainerRef';
import { DragSelectionContext } from './context/SelectionContext';

type DragSelectionContainerProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  handleDragMove?: (e: MouseEvent) => void;
  handleDragMouseUp?: (e: MouseEvent) => void;
  handleDragMouseDown?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
};
export const DragSelectionContainer: FC<DragSelectionContainerProps> = ({
  children,
  handleDragMove,
  handleDragMouseUp,
  handleDragMouseDown,
  style,
}) => {
  const ref = useContainerRect();
  const { box, setBox, containerRect: rect } = useContext(DragSelectionContext);
  const boxRef = useRef<HTMLDivElement>(null);

  const [isClicked, setIsClicked] = useState(false);

  const calculateBox = useMemo(() => {
    if (!box) return null;
    return {
      left: Math.min(box.startPoint.x, box.endPoint.x),
      top: Math.min(box.startPoint.y, box.endPoint.y),
      width: Math.abs(box.startPoint.x - box.endPoint.x),
      height: Math.abs(box.startPoint.y - box.endPoint.y),
    };
  }, [box]);
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsClicked(true);
      if ((e.target as Element).closest('.selection-draggable')) {
        handleDragMouseDown && handleDragMouseDown(e);
        return;
      }
      if (!rect) return;
      if (e.buttons === 2) return;

      setBox({
        startPoint: {
          x: e.clientX - rect.left + window.scrollX,
          y: e.clientY - rect.top + window.scrollY,
        },
        endPoint: {
          x: e.clientX - rect.left + window.scrollX,
          y: e.clientY - rect.top + window.scrollY,
        },
      });
    },
    [setBox, handleDragMouseDown, rect]
  );
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      setIsClicked(false);
      handleDragMouseUp && handleDragMouseUp(e);

      setBox(null);
    },
    [handleDragMouseUp]
  );
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (
        e.buttons === 1 &&
        (e.target as Element).closest('.selection-draggable') &&
        box === null &&
        isClicked
      ) {
        handleDragMove && handleDragMove(e);
        return;
      }

      const element = boxRef.current;
      if (!element || !rect) return;

      if (e.buttons === 2) return;
      setBox(prev => {
        if (!prev) return null;

        return {
          startPoint: prev.startPoint,
          endPoint: {
            x: e.clientX - rect.left + window.scrollX,
            y: e.clientY - rect.top + window.scrollY,
          },
        };
      });
    },
    [box, handleDragMove, rect, isClicked]
  );

  useEffect(() => {
    const handleMouseUpOrMove = (e: MouseEvent) => {
      if (e.type === 'mouseup') {
        handleMouseUp(e);
      } else if (e.type === 'mousemove') {
        handleMouseMove(e);
      }
    };

    window.addEventListener('mouseup', handleMouseUpOrMove);
    window.addEventListener('mousemove', handleMouseUpOrMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUpOrMove);
      window.removeEventListener('mousemove', handleMouseUpOrMove);
    };
  }, [handleMouseUp, handleMouseMove]);
  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        userSelect: 'none',
        borderWidth: '2px',
        borderStyle: 'solid',
        overflow: 'hidden',
        position: 'relative',
        height: '50rem',
        ...style,
      }}
    >
      {calculateBox && (
        <div
          style={{
            position: 'absolute',
            border: '1px solid rgb(96 165 250)',
            backgroundColor: 'rgb(147 197 253 / 0.3)',
            display: 'block',
            ...calculateBox,
          }}
          ref={boxRef}
        />
      )}
      {children}
    </div>
  );
};
