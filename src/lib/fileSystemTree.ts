/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * Represents a file item with a path and optional data.
 * @template T The type of data associated with the file item.
 */
export type FileItem<T = any> = {
  /**
   *  The full path to the file, including the file name.
   */
  path: string;
  data?: T;
};

/**
 * Interface for attributes of a node in a file system tree.
 * @template T The type of data associated with the node.
 */
interface NodeItem<T = any> {
  path: string;
  name: string;
  data?: T;
}

/**
 * Represents the entire file system tree.
 * @template T The type of data stored in the tree nodes.
 */
export class FileSystemTree<T = any> {
  private root: FileSystemNode<T>;

  /**
   * Constructs a file system tree.
   * @param {FileItem<T>[]} [files] - Optional array of FileItems to initialize the tree.
   */
  constructor(files?: FileItem[]) {
    this.root = new FileSystemNode<T>({
      path: '',
      name: 'root',
    });
    if (files) {
      this.root.addFiles(files);
    }
  }

  /**
   * Gets the root node of the file system tree.
   * @returns {FileSystemNode<T>} The root node of the tree.
   */
  getRoot(): FileSystemNode<T> {
    return this.root;
  }
}

/**
 * Represents a node in the file system tree.
 * @template T The type of data stored in the node.
 */
export class FileSystemNode<T = any> {
  readonly path: string;
  readonly directoryPath: string;
  readonly name: string;
  isFolder: boolean;
  children: {
    [filename: string]: FileSystemNode<T>;
  };
  parent: FileSystemNode<T> | null = null;
  data: T | null;

  /**
   * Constructs a file system node with specific attributes.
   * @param {NodeItem<T>} param0 - Attributes of the node.
   */
  constructor({ path, name, data }: NodeItem<T>) {
    this.path = path;
    this.directoryPath = this.path
      .split('/')
      .slice(0, -1)
      .join('/');
    this.name = name;
    this.data = data ?? null;
    this.children = {};
    this.isFolder = false;
  }

  /**
   * Adds a single file to the node.
   * @param {FileItem<T>} file - The file item to be added.
   */
  addFile({ path, data }: FileItem): void {
    const paths = path.split('/');
    let currentNode: FileSystemNode<T> = this;

    paths.forEach((name, index) => {
      const currentPathChild = currentNode.children[name];

      if (!currentPathChild) {
        const newNode = new FileSystemNode({
          path: paths.slice(0, index + 1).join('/'),
          name,
          data: index === paths.length - 1 ? data : null,
        });
        newNode.parent = currentNode;
        currentNode.children[name] = newNode;
        currentNode.isFolder = true;
      }
      currentNode = currentNode.children[name];
    });
  }

  /**
   * Adds multiple files to the node.
   * @param {FileItem<T>[]} files - An array of file items to be added.
   */
  addFiles(files: FileItem[]): void {
    files.forEach(file => {
      this.addFile(file);
    });
  }

  /**
   * Retrieves a node by its path.
   * @param {string} [path] - The path of the node to retrieve.
   * @returns {FileSystemNode<T>} The node at the specified path.
   */
  get(path?: string): FileSystemNode<T> {
    if (!path) return this;
    const paths = path.split('/');
    let file: FileSystemNode<T> = this;

    paths.forEach(name => {
      file = file.children[name];
    });

    return file;
  }

  /**
   * Gets all child nodes of a node.
   * @returns {FileSystemNode<T>[]} An array of child nodes.
   */
  getChildren(): FileSystemNode<T>[] {
    return Object.values(this.children);
  }
}
