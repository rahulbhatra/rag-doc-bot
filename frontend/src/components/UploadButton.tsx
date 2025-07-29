export default function UploadButton({ fetchFiles }: { fetchFiles: () => void }) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/upload", { method: "POST", body: formData });
    fetchFiles();
  };

  return (
    <label className="cursor-pointer">
      <input type="file" className="hidden" onChange={handleChange} />
      <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition">
        +
      </div>
    </label>
  );
}