import { useEffect, useState } from 'react';
import {
  DefaultType,
  DropHandler,
  DropItem,
  FileElement,
  SelectedItem,
} from '../types/types';
import * as React from 'react';

type Props<T extends DefaultType> = {
  item: FileElement<any>;
  children: React.ReactNode;
  isDragging: boolean;
  seletedItem: SelectedItem<T>;
  onDrop?: DropHandler<any>;
};
export const ItemDropzone = <T extends DefaultType>({
  children,
  seletedItem,
  isDragging,
  item,
  onDrop,
}: Props<T>) => {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (!isDragging) setIsHover(false);
  }, [isDragging]);
  return (
    <div
      onMouseEnter={() => {
        if (isDragging) setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      onMouseUp={() => {
        if (!onDrop) return;
        if (seletedItem[item.id]) return;
        const datas: DropItem<T>[] = Object.values(seletedItem).map(v => ({
          id: v.ref.id,
          data: v.data,
        }));
        onDrop(datas, item);
      }}
      style={{
        borderRadius: '10px',
        transitionDuration: '50ms',
        transitionTimingFunction: 'linear',
        transitionProperty: 'all',
        ...(isHover
          ? {
              backgroundColor: '#e9ecef',

              boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
};
