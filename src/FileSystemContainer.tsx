import {
  createRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Boundary,
  DefaultType,
  DropHandler,
  ElementWithBoundary,
  Item,
  MoveAnimation,
  SelectedItem,
} from './types/types';
import SelectionItem from './SelectItem';

import { usePointerPosition } from './hooks/usePointerPosition';
import { useDragLogic } from './hooks/useDragLogic';
import { ItemDropzone } from './ItemDropzone';
import {
  DragSelectionContext,
  DragSelectionProvider,
} from './context/SelectionContext';
import { DragSelectionContainer } from './DragSeletionContainer';
import { FileSystemContext } from './context/FileSystemContext';
import { isEqual } from 'lodash';
import * as React from 'react';
import { useWindowSize } from './hooks/useWindowSize';

type Props<T extends DefaultType> = {
  items: Item<T>[];
  containerStyle?: React.CSSProperties;
  dropHandler?: DropHandler<T>;
};

const _FileSystemContainer = <T extends DefaultType>({
  items,
  dropHandler,
  containerStyle,
}: Props<T>) => {
  const window = useWindowSize();
  const { containerRect, boxBoundary } = useContext(DragSelectionContext);
  const {
    selectedItems,
    setSelectedItems,
    isDragging,
    setIsDragging,
  } = useContext(FileSystemContext);

  const pointer = usePointerPosition({ rect: containerRect });
  // Force update state
  const [updating, setUpdating] = useState(0);

  // Create refs for each item
  const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  useEffect(() => {
    itemRefs.current = Array(items.length)
      .fill(null)
      .map(() => createRef());
    setTimeout(() => setUpdating(prev => prev + 1), 0);
  }, [items]);

  // Calculate the boundaries for each item
  const [boundaries, setBoundaries] = useState<ElementWithBoundary<T>[]>([]);

  useEffect(() => {
    const locations: ElementWithBoundary<T>[] = [];
    itemRefs.current.forEach(ref => {
      if (!ref.current) return;
      const data_index = Number(ref.current.getAttribute('data-index'));

      const data = items[data_index].data;

      locations.push({
        right: ref.current.offsetLeft + ref.current.offsetWidth,
        left: ref.current.offsetLeft,
        top: ref.current.offsetTop,
        bottom: ref.current.offsetTop + ref.current.offsetHeight,
        ref: ref.current,
        data,
      });
    });

    setBoundaries(locations);
  }, [window, updating]);

  const boundaryDict = useMemo(() => {
    const map = new Map<string, ElementWithBoundary<T>>();
    boundaries.forEach(item => {
      map.set(item.ref.id, item);
    });
    return map;
  }, [boundaries]);

  const {
    handleDragMouseDown,
    handleDragMouseUp,
    handleDragMove,
  } = useDragLogic({
    getItem: id => boundaryDict.get(id) ?? null,
    selectedItems,
    setSelectedItems,
    isDragging,
    setIsDragging,
  });

  // Update the selected items based on the current box boundary
  useEffect(() => {
    const newSelectedItems: SelectedItem<T> = {};
    boundaries.forEach(border => {
      const element = boundaryDict.get(border.ref.id);
      if (element && checkCollision(boxBoundary, border)) {
        newSelectedItems[border.ref.id] = element;
      }
    });

    if (!isEqual(newSelectedItems, selectedItems)) {
      setSelectedItems({
        ...newSelectedItems,
      });
    }
  }, [boxBoundary, boundaryDict]);

  const [moveAnimation, setMoveAnimation] = useState<MoveAnimation>({});

  // Calculate the movement animation for selected items during dragging
  useEffect(() => {
    if (!isDragging) {
      setMoveAnimation({});
      return;
    }
    const animations: MoveAnimation = {};

    Object.keys(selectedItems).forEach((id, index) => {
      const targetBoundary = boundaryDict.get(id);
      if (!targetBoundary) return;

      animations[id] = {
        translateX: pointer.x - targetBoundary.left - 10,
        translateY: pointer.y - targetBoundary.top - 10,

        opacity: index === 0 ? 0.5 : 0,
        scale: 0.7,
      };
    });
    setMoveAnimation(animations);
  }, [isDragging, pointer]);

  return (
    <DragSelectionContainer
      handleDragMouseDown={handleDragMouseDown}
      handleDragMouseUp={handleDragMouseUp}
      handleDragMove={handleDragMove}
      style={containerStyle}
    >
      <div
        style={{
          width: '100%',
          margin: '1rem',
          display: 'flex',
        }}
      >
        {items.map((item, index) => (
          <div key={item.id}>
            <SelectionItem
              movement={moveAnimation[item.id]}
              ref={itemRefs.current[index]}
              id={item.id}
              index={index}
              isSelected={!!selectedItems[item.id]}
              isDragging={!!selectedItems[item.id] && isDragging}
              element={boundaryDict.get(item.id)}
            >
              {item.droppable ? (
                <ItemDropzone
                  isDragging={isDragging}
                  item={item}
                  seletedItem={selectedItems}
                  onDrop={item.onDrop ?? dropHandler}
                >
                  {item.render ? item.render(item.data) : item.children}
                </ItemDropzone>
              ) : (
                <div>
                  {item.render ? item.render(item.data) : item.children}
                </div>
              )}
            </SelectionItem>
          </div>
        ))}
      </div>

      {isDragging && (
        <div
          style={{
            cursor: 'default',
            position: 'fixed',
            left: pointer.x + (containerRect?.left ?? 0),
            top: pointer.y + (containerRect?.top ?? 0),
            transform: 'translate(1rem, 2rem)',
            color: 'white',
          }}
        >
          {Object.keys(selectedItems).length > 1 && (
            <div
              style={{
                backgroundColor: 'blueviolet',
                display: 'flex',
                color: 'white',
                fontSize: '1rem',
                borderRadius: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: '1rem',
                height: '1rem',
              }}
            >
              {Object.keys(selectedItems).length}
            </div>
          )}
        </div>
      )}
    </DragSelectionContainer>
  );
};

const checkCollision = <T extends DefaultType>(
  selection: Boundary,
  target: ElementWithBoundary<T>
): boolean => {
  return !(
    selection.left > target.right ||
    selection.right < target.left ||
    selection.top > target.bottom ||
    selection.bottom < target.top
  );
};

export const FileSystemContainer = <T extends DefaultType>(props: Props<T>) => (
  <DragSelectionProvider>
    <_FileSystemContainer {...props} />
  </DragSelectionProvider>
);
