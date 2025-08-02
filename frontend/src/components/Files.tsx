import { IoClose } from "react-icons/io5";
import {
  useDeleteDocument,
  type UploadedFile,
} from "../hooks/useChatSessionDocuments";

interface UploadedFileListProps {
  sessionId: number | null;
  files: UploadedFile[];
}

const Files = ({ sessionId, files }: UploadedFileListProps) => {
  const { mutate: deleteFile } = useDeleteDocument();
  if (files.length === 0) return null;

  const onDelete = (filename: string) => {
    if (!sessionId) return;
    deleteFile({ sessionId, filename });
  };

  return (
    <div className="mb-3">
      <h3 className="text-sm font-medium text-gray-600 mb-1">
        📂 Uploaded Files
      </h3>
      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <div
            key={`${file.filename}-${file.uploaded_at}`}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 max-w-xs truncate"
            title={file.filename}
          >
            <span className="truncate max-w-[120px]">{file.filename}</span>
            <button
              onClick={() => onDelete(file.filename)}
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
