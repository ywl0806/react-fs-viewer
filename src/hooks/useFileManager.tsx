import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileElement } from '../types/types';
import { FileSystemNode, FileSystemTree } from '../lib/fileSystemTree';

type UseFileManagerProps = {
  path?: string;
  fileList?: string[];
};

export const useFileManager = <T extends unknown = unknown>({
  path,
  fileList,
}: UseFileManagerProps) => {
  const [files, setFiles] = useState<FileElement<T>[]>([]);

  // 現在のディレクトリの1つ上のディレクトリを計算する
  const prevDirectory = useMemo(() => {
    if (!path) return '';
    return path
      .split('/')
      .slice(0, -1)
      .join('/');
  }, [path]);

  // 戻るフォルダーアイテムを作成する関数
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
  // ファイルまたはフォルダーアイテムを作成する関数
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
    // ファイルリストがなければ処理を終了する
    if (!fileList) return;

    // ファイルツリーを作成する
    const tree = new FileSystemTree(
      fileList.map(filePath => ({ path: filePath }))
    );
    const root = tree.getRoot();
    const currentDirectory = root.get(path);

    // 現在のディレクトリが存在しない場合、戻るオプションを設定する
    if (!currentDirectory) {
      setFiles([createBackFolderItem()]);
      return;
    }

    // 現在のディレクトリの子要素を取得して設定する
    const newFiles = currentDirectory.getChildren().map(createFileItem);
    setFiles(path ? [createBackFolderItem(), ...newFiles] : newFiles);
  }, [fileList, path]);

  return { files };
};
