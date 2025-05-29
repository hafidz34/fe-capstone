import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { useRef } from "react";

interface FileUploadButtonProps {
  onFilesSelected?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  uploadUrl?: string;
  onUploadSuccess?: () => void;
}

const FileUploadButton = ({
  onFilesSelected = () => {},
  accept = ".xlsx,.xls",
  multiple = true,
  uploadUrl,
  onUploadSuccess = () => {},
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);

      if (uploadUrl) {
        try {
          const formData = new FormData();
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token") || "",
            },
            body: formData,
          });

          if (response.ok) {
            onUploadSuccess();
            alert("Upload berhasil!");
            const match = files[0].name.match(/\[(\d{4})\]/);
            if (match) {
              const year = match[1];
              localStorage.setItem("selectedYear", year);
              const years = JSON.parse(
                localStorage.getItem("availableYears") || "[]"
              );
              if (!years.includes(year)) {
                years.push(year);
                localStorage.setItem("availableYears", JSON.stringify(years));
              }
            }
            navigate("/dashboard");
          } else {
            console.error("Upload failed");
            alert("Upload gagal!");
          }
        } catch (err) {
          console.error("Error uploading files:", err);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className="w-72 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg flex justify-center items-center transition hover:from-indigo-600 hover:to-blue-600"
        aria-label="Select Excel files">
        <span className="text-white text-xl font-semibold tracking-wide">
          Select EXCEL files
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <span className="text-xs text-gray-400 mt-1">
        Only .xlsx or .xls files allowed
      </span>
    </div>
  );
};

export default FileUploadButton;
