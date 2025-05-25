import type { ChangeEvent } from "react";
import { useRef } from "react";

interface FileUploadButtonProps {
  onFilesSelected?: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  uploadUrl?: string; // URL to upload files
}

const FileUploadButton = ({
  onFilesSelected = () => {},
  accept = ".xlsx,.xls",
  multiple = true,
  uploadUrl,
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            formData.append("files", files[i]);
          }

          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            console.error("Upload failed:", response.statusText);
          } else {
            console.log("Files uploaded successfully");
          }
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      }
    }
  };

  return (
    <div className="inline-flex">
      <button
        onClick={handleClick}
        className="w-[330px] h-20 bg-[#4d44b5] rounded-xl shadow-[0px_3px_6px_0px_rgba(0,0,0,0.14)] flex justify-center items-center"
        aria-label="Select Excel files"
      >
        <span className="text-white text-2xl font-normal leading-7 text-center">
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
    </div>
  );
};

export default FileUploadButton;
