import Upload from "../components/Upload";
import DownloadTemplateButton from "../components/TemplateDownload";

export default function Dashboard() {
  return (
    <div
      className="flex flex-col items-center justify-center bg-[#F3F4FF]"
      style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="mb-8">
        <DownloadTemplateButton />
      </div>
      <Upload />
    </div>
  );
}
