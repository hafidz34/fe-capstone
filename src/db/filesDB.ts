// --- MongoDB/Express Backend Example for File Upload, List, Download, and Delete ---
// Replace the localStorage logic below with API calls to your backend for production.
// This example assumes you have an Express server with endpoints for upload, list, download, and delete,
// and a MongoDB "files" collection. Adjust the endpoint URLs and logic as needed.

/*
import axios from "axios";

// Upload a file (call this in your FileManager component)
export async function uploadFile(file: File, uploadedBy: string): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("file", file); // The backend should handle file uploads (e.g., multer)
    formData.append("uploadedBy", uploadedBy);

    // Change this URL to your actual backend endpoint
    const response = await axios.post("http://localhost:5000/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // The backend should return success status
    return response.data && response.data.success;
  } catch (error) {
    console.error("Upload error:", error);
    return false;
  }
}

// List all files (call this to get the list of uploaded files)
export async function fetchFiles(): Promise<FileRecord[]> {
  try {
    const response = await axios.get("http://localhost:5000/api/files");
    // Adjust according to your backend's response structure
    return response.data.files;
  } catch (error) {
    console.error("Fetch files error:", error);
    return [];
  }
}

// Download a file by ID (call this to download a file)
export async function downloadFile(fileId: string): Promise<Blob | null> {
  try {
    const response = await axios.get(`http://localhost:5000/api/files/download/${fileId}`, {
      responseType: "blob",
    });
    return response.data as Blob;
  } catch (error) {
    console.error("Download error:", error);
    return null;
  }
}

// Delete a file by ID (call this to delete a file)
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    const response = await axios.delete(`http://localhost:5000/api/files/${fileId}`);
    return response.data && response.data.success;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}
*/

// --- LocalStorage logic for development/testing only ---

export type FileRecord = {
  id: string;
  filename: string;
  uploadedBy: string | null;
  uploadedAt: string;
  content?: string; // base64 string
};

const STORAGE_KEY = "files-db";

function getFiles(): FileRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveFiles(files: FileRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

const filesDB = {
  getAll: getFiles,
  add: (file: FileRecord) => {
    const files = getFiles();
    files.push(file);
    saveFiles(files);
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default filesDB;
