import * as React from 'react';
import { Item } from './selection-system/types/types';
import { FileSystemContainer } from './selection-system/FileSystemContainer';
import { FileSystemProvider } from './selection-system/context/FileSystemContext';
const Folder = ({ title }: { title?: string }) => (
  <div
    style={{
      width: '5rem',
      height: '6rem',
      backgroundColor: 'red',
    }}
  >
    <div className="h-[2rem] align-middle">{title}</div>
  </div>
);

const File = ({ title }: { title?: string }) => (
  <div
    style={{
      width: '5rem',
      height: '6rem',
      backgroundColor: 'red',
    }}
  >
    <div className="h-[2rem] align-middle">{title}</div>
  </div>
);
type Hoge = {
  title: string;
};
const items: Item<Hoge>[] = [
  {
    id: 'hogehoge',
    render: data => {
      return <Folder title={data?.title} />;
    },
    data: {
      title: 'folder5',
    },

    droppable: true,
  },
  {
    id: '11',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },
  {
    id: '12',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },
];

const items2: Item<Hoge>[] = [
  {
    id: '13',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },

  {
    id: '15235235',
    render: data => {
      return <Folder title={data?.title} />;
    },
    data: {
      title: 'folder1',
    },
    droppable: true,
  },
  {
    id: '235235232',
    render: data => {
      return <Folder title={data?.title} />;
    },
    data: {
      title: 'folder2',
    },
    droppable: true,
  },
  {
    id: '213',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },
  {
    id: '214',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },
  {
    id: '311',
    render: data => {
      return <File title={data?.title} />;
    },
    data: {
      title: 'file',
    },
  },
];

export const Thing = () => {
  return (
    <div>
      <div>
        <div>
          <FileSystemProvider>
            <div>
              <div
                style={{
                  height: '50rem',
                  margin: '2rem',
                }}
              >
                <FileSystemContainer
                  containerStyle={{
                    height: '20rem',
                  }}
                  items={items}
                  dropHandler={(dropData, data) => {
                    console.log(dropData);
                    console.log(data);
                  }}
                ></FileSystemContainer>
                <FileSystemContainer
                  items={items2}
                  dropHandler={(dropData, data) => {
                    console.log(dropData);
                    console.log(data);
                  }}
                ></FileSystemContainer>
              </div>
            </div>
          </FileSystemProvider>
        </div>
      </div>
    </div>
  );
};
