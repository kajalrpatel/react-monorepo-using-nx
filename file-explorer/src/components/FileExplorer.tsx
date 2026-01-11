import { useState } from 'react';
import FileNode from './FileNode';

export type FileNodeType = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
  parentId?: string;
  children?: string[];
};
type FileNodes = {
  [key: string]: FileNodeType;
};

const FileExplorer = () => {
  const [tree, setTree] = useState<FileNodes>({
    '1': {
      id: '1',
      name: 'src',
      type: 'folder',
      isOpen: false,
      children: ['2', '3'],
    },
    '2': { id: '2', name: 'index.js', type: 'file', parentId: '1' },
    '3': { id: '3', name: 'App.js', type: 'file', parentId: '1' },
  });
  console.log(tree);
  const toggleOpen = (id: string, isOpen?: boolean) => {
    setTree((prevTree) => {
      return {
        ...prevTree,
        [id]: {
          ...prevTree[id],
          isOpen: !isOpen,
        },
      };
    });
  };
  const renameNode = (id: string, newName: string) => {
    setTree((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        name: newName,
      },
    }));
  };
  const addNode = (parentId: string, type: 'file' | 'folder') => {
    const newId = Date.now().toString();
    setTree((prev) => ({
      ...prev,
      [parentId]: {
        ...prev[parentId],
        isOpen: true,
        children: [...(prev[parentId].children || []), newId],
      },
      [newId]: {
        id: newId,
        name: type === 'file' ? 'new-file.txt' : 'new-folder',
        type,
        isOpen: false,
        parentId,
      },
    }));
  };
  const removeNode = (id: string) => {
    const allNodes = { ...tree };
    allNodes[id].children?.forEach((childId) => {
      delete allNodes[childId];
    });
    delete allNodes[id];
    console.log(allNodes);
    setTree(allNodes);
  };
  return (
    <div className="flex flex-col p-2">
      {Object.values(tree)
        .filter((node) => node.parentId === undefined)
        .map((node) => (
          <FileNode
            key={node.id}
            node={node}
            tree={tree}
            toggleOpen={toggleOpen}
            renameNode={renameNode}
            addNode={addNode}
            removeNode={removeNode}
          />
        ))}
    </div>
  );
};
export default FileExplorer;
