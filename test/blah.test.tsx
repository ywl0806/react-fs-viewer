/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { FileSystemContainer, FileSystemProvider } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');

    const root = createRoot(div);

    root.render(
      <FileSystemProvider>
        <FileSystemContainer items={[]}></FileSystemContainer>
      </FileSystemProvider>
    );
    root.unmount();
  });
});
