import { createContext, useEffect, useMemo, useState } from 'react';
import { Boundary, ElementPosition, SelectionBox } from '../types/types';
import * as React from 'react';

type SelectionContextType = {
  box: SelectionBox | null;
  setBox: React.Dispatch<React.SetStateAction<SelectionBox | null>>;
  selectionBox: SelectionBox;
  setSelectionBox: React.Dispatch<React.SetStateAction<SelectionBox>>;
  boxBoundary: Boundary;
  containerRect: ElementPosition | null;
  setContainerRect: React.Dispatch<
    React.SetStateAction<ElementPosition | null>
  >;
};

export const DragSelectionContext = createContext<SelectionContextType>({
  box: null,
  setBox: _ => {},
  selectionBox: {
    startPoint: {
      x: 0,
      y: 0,
    },
    endPoint: {
      x: 0,
      y: 0,
    },
  },
  setSelectionBox: _ => {},
  boxBoundary: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  containerRect: null,
  setContainerRect: _ => {},
});

type Props = {
  children: React.ReactNode;
};
export const DragSelectionProvider = ({ children }: Props) => {
  const [box, setBox] = useState<SelectionBox | null>(null);
  const [containerRect, setContainerRect] = useState<ElementPosition | null>(
    null
  );

  const [selectionBox, setSelectionBox] = useState<SelectionBox>({
    startPoint: {
      x: 0,
      y: 0,
    },
    endPoint: {
      x: 0,
      y: 0,
    },
  });
  useEffect(() => {
    setSelectionBox(prev => {
      if (box) return box;
      return prev;
    });
  }, [box]);

  // Calculate the boundary box based on the selection box
  const boxBoundary: Boundary = useMemo(
    () => ({
      right: Math.max(selectionBox.endPoint.x, selectionBox.startPoint.x),
      left: Math.min(selectionBox.endPoint.x, selectionBox.startPoint.x),
      bottom: Math.max(selectionBox.endPoint.y, selectionBox.startPoint.y),
      top: Math.min(selectionBox.endPoint.y, selectionBox.startPoint.y),
    }),
    [selectionBox]
  );

  return (
    <DragSelectionContext.Provider
      value={{
        box,
        setBox,
        selectionBox,
        setSelectionBox,
        boxBoundary,
        containerRect,
        setContainerRect,
      }}
    >
      {children}
    </DragSelectionContext.Provider>
  );
};
