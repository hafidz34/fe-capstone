import { useState, useEffect } from "react";

type FileRecord = {
  year: number;
  filename: string;
  uploadedBy?: string | null;
};

export default function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setFiles([]);
      return;
    }
    fetch("http://localhost:8000/api/data/years", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 400) {
            alert("You are not authorized. Please login again.");
          }
          setFiles([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles([]);
        }
      })
      .catch(() => setFiles([]));
  }, [token]);

  const handleDownload = async (year: number) => {
    if (!token) {
      alert("No authentication token found.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/data/file/${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `[${year}] REKAPITULASI.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Download failed: " + err.message);
    }
  };

  return (
    <div className="my-8 w-full mx-auto p-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Uploaded Files</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Tahun</th>
              <th className="px-4 py-2 text-left">Nama File</th>
              <th className="px-4 py-2 text-left">Uploaded By</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-gray-400 py-6 text-center">
                  No files uploaded yet.
                </td>
              </tr>
            ) : (
              files.map((file, idx) => (
                <tr
                  key={file.year}
                  className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{file.year}</td>
                  <td className="px-4 py-2">{file.filename}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => handleDownload(file.year)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
