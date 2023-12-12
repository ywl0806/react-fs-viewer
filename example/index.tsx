import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  CreateFileElement,
  FileElement,
  FileSystemContainer,
  FileSystemProvider,
  useFileManager,
  useFileSystem,
} from '../.';
import { Folder } from './src/component/Folder';
import { File } from './src/component/File';
import { FileItem } from '../dist/lib/fileSystemTree';

type FileData = {
  title: string;
};
const items: FileItem<FileData>[] = [];

const Files = () => {
  const { selectedItems } = useFileSystem();

  const fileItems = React.useMemo(
    () => [
      {
        path: 'file1',
        data: {
          title: 'file1',
        },
      },
      {
        path: 'file2',
        data: {
          title: 'file2',
        },
      },
      {
        path: 'file3',
        data: {
          title: 'file3',
        },
      },
      {
        path: 'folder1/file4',
        data: {
          title: 'file4',
        },
      },
      {
        path: 'folder2/file4',
        data: {
          title: 'file4',
        },
      },
    ],
    []
  );
  const createFileElement: CreateFileElement<FileData> = React.useCallback(
    (filedata, currentDirectory) => {
      const elements: FileElement<FileData>[] = filedata.map(file => {
        return {
          data: {
            title: file.name,
            file,
          },
          id: file.path,
          render(data) {
            if (file.isFolder) return <Folder title={data.title} />;
            return <File title={data.title} />;
          },
          onDubbleClick(data) {
            console.log(data);
          },
          droppable: file.isFolder,
        };
      });

      return elements;
    },
    []
  );
  const [files] = useFileManager<FileData>({
    path: '',
    fileItems,
    createFileElement,
  });

  return (
    <div
      style={{
        height: '50rem',
        margin: '2rem',
      }}
    >
      <FileSystemContainer
        items={files}
        dropHandler={(dropData, data) => {
          console.log(dropData);
          console.log(data);
        }}
      ></FileSystemContainer>
    </div>
  );
};
const App = () => {
  return (
    <FileSystemProvider>
      <Files />
    </FileSystemProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
