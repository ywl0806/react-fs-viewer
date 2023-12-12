import { useEffect, useRef, useState } from 'react';
import { CreateFileElement, DefaultType, FileElement } from '../types/types';
import {
  FileItem,
  FileSystemNode,
  FileSystemTree,
} from '../lib/fileSystemTree';

/**
 * Props for useFileManager hook.
 * @property {string} [path] - The current path.
 * @property {FileItem[]} [fileList] - The list of file.
 */
type UseFileManagerProps<T extends DefaultType<T> = DefaultType> = {
  path?: string;
  fileItems: FileItem<T>[];
  createFileElement: CreateFileElement<T>;
};

type UseFileManagerReturns<T extends DefaultType<T> = DefaultType> = [
  FileElement<T>[],
  FileSystemNode<T> | null
];
/**
 * A hook for managing file elements in a file system.
 * @param {UseFileManagerProps} props - The properties for the file manager.
 * @returns {FileElement[]} files - files for rendering
 */
export const useFileManager = <T extends DefaultType<T> = DefaultType>({
  path,
  fileItems,
  createFileElement,
}: UseFileManagerProps<T>): UseFileManagerReturns<T> => {
  const [files, setFiles] = useState<FileElement<T>[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<FileSystemNode<
    T
  > | null>(null);

  const tree = useRef<FileSystemTree<T>>(new FileSystemTree());

  useEffect(() => {
    // Create a file system tree
    tree.current = new FileSystemTree(fileItems);
  }, [fileItems]);

  useEffect(() => {
    const newCurrentDirectory = tree.current.getRoot().get(path);
    // Update current directory and files in a single state update
    setCurrentDirectory(newCurrentDirectory);
    const current = tree.current.getRoot().get(path);
    setFiles(createFileElement(current?.getChildren() ?? [], current));
  }, [path]);

  return [files, currentDirectory];
};
