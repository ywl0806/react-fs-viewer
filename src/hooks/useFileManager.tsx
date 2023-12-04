import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileElement } from '../types/types';
import { FileSystemNode, FileSystemTree } from '../lib/fileSystemTree';

/**
 * Props for useFileManager hook.
 * @property {string} [path] - The current path.
 * @property {string[]} [fileList] - The list of file paths.
 */
type UseFileManagerProps = {
  path?: string;
  fileList?: string[];
};

/**
 * A hook for managing file elements in a file system.
 * @param {UseFileManagerProps} props - The properties for the file manager.

 */
export const useFileManager = <T extends unknown = unknown>({
  path,
  fileList,
}: UseFileManagerProps): object => {
  const [files, setFiles] = useState<FileElement<T>[]>([]);
  const tree = useRef<FileSystemTree<T>>(new FileSystemTree());

  // Calculate the directory one level up from the current directory
  const prevDirectory = useMemo(() => {
    if (!path) return '';
    return path
      .split('/')
      .slice(0, -1)
      .join('/');
  }, [path]);

  // Function to create a back folder item
  const createBackFolderItem = useCallback((): FileElement<any> => {
    return {
      id: prevDirectory || 'root',
      data: {
        file: new FileSystemNode({ path: prevDirectory, name: '' }),
      },
      //   render: () => <Folder title="..." />,
      droppable: true,
    };
  }, [prevDirectory]);

  const renderFiles = useCallback(
    (currentPath?: string) => {
      const root = tree.current.getRoot();

      const currentDirectory = root.get(currentPath);

      // If the current directory does not exist, set the option to go back
      if (!currentDirectory) {
        setFiles([createBackFolderItem()]);
        return;
      }

      // Get and set the child elements of the current directory
      const newFiles = currentDirectory.getChildren().map(createFileItem);
      setFiles(path ? [createBackFolderItem(), ...newFiles] : newFiles);
    },
    [setFiles, createBackFolderItem]
  );

  // Function to create a file or folder item
  const createFileItem = useCallback((file: FileSystemNode<T>): FileElement<
    any
  > => {
    const { path, isFolder, data } = file;
    return {
      id: path,
      data: data
        ? {
            file,
            ...data,
          }
        : { file },

      //   render: data =>
      //     isFolder ? (
      //       <Folder title={data.file.name} />
      //     ) : (
      //       <File title={data.file.name} />
      //     ),
      droppable: isFolder,
    };
  }, []);

  useEffect(() => {
    // Terminate the process if the file list is not provided
    if (!fileList) return;

    // Create a file system tree
    tree.current = new FileSystemTree(
      fileList.map(filePath => ({ path: filePath }))
    );
    renderFiles(path);
  }, [fileList]);

  useEffect(() => {
    // Render files when the path changes
    renderFiles(path);
  }, [path]);

  return { files };
};
