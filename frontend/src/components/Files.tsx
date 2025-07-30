import { IoClose } from "react-icons/io5";

interface UploadedFileListProps {
  files: string[];
  onDelete: (filename: string) => void;
}

const Files = ({ files, onDelete }: UploadedFileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-sm font-medium text-gray-600 mb-1">📂 Uploaded Files</h3>
      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <div
            key={file}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 max-w-xs truncate"
            title={file}
          >
            <span className="truncate max-w-[120px]">{file}</span>
            <button
              onClick={() => onDelete(file)}
              className="ml-2 text-gray-500 hover:text-gray-900"
              title="Remove file"
            >
              <IoClose className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Files;