import FileManager from "../components/FileManager";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <FileManager />
    </div>
  );
}
