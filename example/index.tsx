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
        path: 'hoge',
        data: {
          title: 'hoge',
        },
      },
      {
        path: 'hoge2',
        data: {
          title: 'hoge',
        },
      },
      {
        path: 'hoge3',
        data: {
          title: 'hoge',
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
