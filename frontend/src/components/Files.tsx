// components/FileList.tsx
const Files = ({ files, onDelete }: { files: string[]; onDelete: (f: string) => void }) => (
  <div className="flex flex-wrap gap-2 mt-2">
  {files.map((file) => (
    <div
      key={file}
      className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl shadow-sm max-w-xs"
    >
      <div className="bg-white p-2 rounded-full border">
        {/* File icon (optional: use heroicons or emoji 📄) */}
        <span role="img" aria-label="file">📄</span>
      </div>
      <span className="truncate text-sm max-w-[120px]">{file}</span>
      <button
        onClick={() => onDelete(file)}
        className="text-sm text-red-500 hover:underline"
        type="button"
      >
        Delete
      </button>
    </div>
  ))}
</div>
);
export default Files;