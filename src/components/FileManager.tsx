import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import filesDB from "../db/filesDB";

type FileRecord = {
  id: string;
  filename: string;
  uploadedBy: string | null;
  uploadedAt: string;
  content?: string; // tetap dipakai untuk upload lokal saja
};

export default function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    setFiles(filesDB.getAll());
  }, [uploading]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Only Excel files are allowed.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      filesDB.add({
        id: Date.now().toString(),
        filename: file.name,
        uploadedBy: localStorage.getItem("role"),
        uploadedAt: new Date().toISOString(),
        content: reader.result as string,
      });
      setUploading((u) => !u);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (file: FileRecord) => {
    try {
      // 1. Ambil token JWT (ganti key "token" sesuai tempat penyimpananmu)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found.");
        return;
      }

      // 2. Fetch file dari API sebagai blob
      const res = await fetch(
        `http://localhost:8000/api/data/file/0`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const blob = await res.blob();

      // 3. Buat temporary object URL dan trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename.endsWith(".xlsx")
        ? file.filename
        : `${file.filename} .xlsx`;
      document.body.appendChild(link);
      link.click();

      // 4. Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert(`Download failed: ${err.message}`);
    }
  };

  return (
    <div className="my-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
      {role === "admin" && (
        <div className="mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUpload}
            className="block"
          />
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {files.map((file) => (
          <li
            key={file.id}
            className="py-2 flex justify-between items-center"
          >
            <span>{file.filename}</span>
            <button
              onClick={() => handleDownload(file)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Download
            </button>
          </li>
        ))}
        {files.length === 0 && <li>No files uploaded yet.</li>}
      </ul>
    </div>
  );
}
