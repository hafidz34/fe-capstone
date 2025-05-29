import axios from 'axios';

export async function checkConnect() {
  try {
    const res = await axios.get("/")
    console.log("Connected to server:", res.status);
  } catch (error) {
    console.error("Error connecting to server:", error);
    throw new Error("Server is not reachable. Please check your connection.");
  }
}