import FileUploadButton from "../components/FileUploadButton";

export default function Upload() {
  const handleFilesSelected = (files: FileList) => {
    console.log("Selected files:", files);
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FileUploadButton
      onFilesSelected={handleFilesSelected}
      uploadUrl="http://localhost:8000/api/data/upload"
      />
    </div>
  );
}
