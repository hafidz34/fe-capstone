import React from "react";
import axios from "axios";

export default function DownloadTemplateButton() {
  const handleDownload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No authentication token found.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:8000/api/data/file/0", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "TEMPLATE.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert("Download failed: " + (err.response?.statusText || err.message));
      } else if (err instanceof Error) {
        alert("Download failed: " + err.message);
      } else {
        alert("Download failed: An unknown error occurred.");
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-emerald-600 transition font-semibold">
      Download Template
    </button>
  );
}
