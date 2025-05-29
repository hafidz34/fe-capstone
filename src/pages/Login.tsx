import React, { useEffect } from "react";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google/login";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4">
      Login with Google
    </button>
  );
}

export default function Login() {
  // Handle Google OAuth2 redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F4FF]">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <GoogleLoginButton />
    </div>
  );
}
