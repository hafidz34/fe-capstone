import FileUploadButton from "../components/FileUploadButton";

export default function Upload() {
  // This handler will upload the selected file to the backend using the correct API and JWT
  const handleFilesSelected = async (files: FileList) => {
    if (!files.length) return;
    const file = files[0];

    // Optional: warn user if filename does not match required pattern
    const fileRE = /^\[\d{4}\] REKAPITULASI\.xlsx$/;
    if (!fileRE.test(file.name)) {
      alert("Nama file harus sesuai format: [YYYY] REKAPITULASI.xlsx");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda belum login.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/data/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Upload berhasil!");
        // Optionally refresh data/UI here
      } else {
        const errorText = await response.text();
        alert("Upload gagal! " + errorText);
      }
    } catch (err: any) {
      alert("Upload gagal! " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center rounded-xl p-2 w-full">
      <FileUploadButton
        onFilesSelected={handleFilesSelected}
        uploadUrl={undefined} // Use our own handler
      />
    </div>
  );
}
