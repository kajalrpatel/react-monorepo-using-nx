import { useState } from 'react';
import { FileNodeType } from './FileExplorer';
import { File, Folder, FolderOpen, PencilIcon, Trash } from 'lucide-react';

type FileNodeProps = {
  node: FileNodeType;
  toggleOpen: (id: string, isOpen?: boolean) => void;
  tree: { [key: string]: FileNodeType };
  renameNode: (id: string, newName: string) => void;
  addNode: (parentId: string, type: 'file' | 'folder') => void;
  removeNode: (id: string) => void;
};
const FileNode = ({
  node,
  toggleOpen,
  tree,
  renameNode,
  addNode,
  removeNode,
}: FileNodeProps) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(node.name);
  const Icon =
    node.type === 'folder' ? (node.isOpen ? FolderOpen : Folder) : File;
  const handleRename = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      alert('Name cannot be empty');
    }
    renameNode(node.id, e.target.value);
    setEditing(false);
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon size={16} />
        {node.type === 'folder' && (
          <button onClick={() => toggleOpen(node.id, node.isOpen)}>
            {node.name}
          </button>
        )}
        {node.type === 'file' && !editing && <span>{node.name}</span>}
        {node.type === 'file' && editing && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleRename}
            className="border border-slate-300 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-sky-200"
          />
        )}
        <button onClick={() => setEditing((prev) => !prev)}>
          <PencilIcon size={14} className="ml-2 cursor-pointer" />
        </button>
        {node.type === 'folder' && (
          <>
            <button onClick={() => addNode(node.id, 'file')}>
              <File size={14} className="cursor-pointer" />
            </button>
            <button onClick={() => addNode(node.id, 'folder')}>
              <Folder size={14} className="cursor-pointer" />
            </button>
          </>
        )}
        <button onClick={() => removeNode(node.id)}>
          <Trash size={14} className="cursor-pointer" />
        </button>
      </div>
      {node.type === 'folder' && node.isOpen && node.children && (
        <div className="ml-4 ">
          {node.children
            .map((childId) => tree[childId])
            .filter(Boolean)
            .map((child) => (
              <FileNode
                key={child.id}
                node={child}
                tree={tree}
                toggleOpen={toggleOpen}
                renameNode={renameNode}
                addNode={addNode}
                removeNode={removeNode}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FileNode;
