import { useCallback } from 'react';
import {
  DefaultType,
  ElementWithBoundary,
  FindDraggableElement,
  HandleDragMouseDown,
  HandleDragMouseMove,
  HandleDragMouseUp,
  SelectedItem,
} from '../types/types';

type UseDragProps<T extends DefaultType> = {
  getItem: (id: string) => ElementWithBoundary<T> | null;
  selectedItems: SelectedItem<T> | null;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem<T>>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};
export const useDragLogic = <T extends DefaultType>({
  getItem,
  selectedItems,
  setSelectedItems,
  isDragging,
  setIsDragging,
}: UseDragProps<T>) => {
  const findDraggableElement: FindDraggableElement = useCallback(
    (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      return (e.target as Element).closest('.selection-draggable');
    },
    []
  );

  const handleDragMouseDown: HandleDragMouseDown = useCallback(
    e => {
      const item = findDraggableElement(e);
      if (!item) return false;

      const element = getItem(item.id);
      if (!element) return false;
      if (!selectedItems?.[item.id]) {
        if (e.metaKey || e.ctrlKey) {
          setSelectedItems(prev => {
            prev[item.id] = element;
            return {
              ...prev,
            };
          });
          return true;
        }
        setSelectedItems(() => ({
          [item.id]: element,
        }));
      }
      return true;
    },
    [isDragging, selectedItems]
  );
  const handleDragMouseUp: HandleDragMouseUp = useCallback(() => {
    setIsDragging(false);
    return true;
  }, []);

  const handleDragMove: HandleDragMouseMove = useCallback((e: MouseEvent) => {
    if (findDraggableElement(e)) {
      setIsDragging(true);
      return true;
    }
    return false;
  }, []);

  return {
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMove,
  };
};
