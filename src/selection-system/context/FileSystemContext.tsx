import { FC, createContext, useRef, useState } from 'react';
import { DefaultType, SelectedItem } from '../types/types';
import * as React from 'react';

type FileSystemContextType<T extends DefaultType> = {
  selectedItems: SelectedItem<T>;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem<T>>>;

  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FileSystemContext = createContext<
  FileSystemContextType<DefaultType>
>({
  selectedItems: {},
  setSelectedItems: () => {},

  isDragging: false,
  setIsDragging: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const FileSystemProvider: FC<Props> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem<DefaultType>>(
    {}
  );

  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <FileSystemContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        isDragging,
        setIsDragging,
      }}
    >
      <div ref={ref}>{children}</div>
    </FileSystemContext.Provider>
  );
};
