import { FileSystemNode } from '../lib/fileSystemTree';

export type Point = {
  x: number;
  y: number;
};

export type SelectionBox = {
  startPoint: Point;
  endPoint: Point;
};

export type DefaultType<T extends unknown = unknown> = {
  [P in keyof T]: P extends 'file' ? never : T[P];
};

export type FileData<T extends DefaultType<T> = DefaultType> = {
  file?: FileSystemNode;
} & T;

export type FileElement<T extends DefaultType<T>> = {
  data: FileData<T>;
  droppable?: boolean;
  onDrop?: DropHandler<T>;
  onDubbleClick?: DoubleClickHandler<T>;
  render?: (data: FileData<T>) => React.ReactNode;
  children?: React.ReactNode;
  id: string;
};

export type Boundary = {
  right: number;
  left: number;
  top: number;
  bottom: number;
};
export type ElementWithBoundary<T extends DefaultType<T> = DefaultType> = {
  ref: HTMLDivElement;
  data: FileData<T>;
} & Boundary;
export type SelectedItem<T extends DefaultType<T> = DefaultType> = {
  [key: string]: ElementWithBoundary<T>;
};

export type Movement = {
  translateX: number;
  translateY: number;
  scale: number;
  opacity: number;
  left?: number;
  top?: number;
};

export type MoveAnimation = {
  [key: string]: Movement;
};
export type DoubleClickHandler<T extends DefaultType<T> = DefaultType> = (
  data: FileData<T>,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => void;
export type DropHandler<T extends DefaultType<T> = DefaultType> = (
  dropData: DropItem<T>[],
  current: FileElement<T>
) => void;

export type DropItem<T extends DefaultType<T>> = {
  id: string;
  data: FileData<T>;
};

export type HandleDragMouseDown = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => boolean;

export type HandleDragMouseUp = (e: MouseEvent) => boolean;
export type HandleDragMouseMove = (e: MouseEvent) => boolean;
export type FindDraggableElement = (
  e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
) => Element | null;

export type ElementPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

export type CreateFileElement<T extends DefaultType<T> = DefaultType> = (
  files: FileSystemNode<T>[],
  currentDirectory: FileSystemNode<T> | null
) => FileElement<T>[];
