import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google/login";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-[#4285F4] text-white font-semibold text-base rounded-full shadow-md hover:bg-white hover:text-[#4285F4] hover:border hover:border-[#4285F4] transition-all duration-300 w-full"
    >
      <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />
      <span>Login with Google</span>
    </button>
  );
}

export default function Login() {
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
    <div className="min-h-screen flex items-center justify-center bg-[#E6ECFF]">
      {/* Container Box */}
      <div className="flex flex-col md:flex-row w-full max-w-[1500px] h-[750px] max-w-6xl shadow-lg rounded-xl overflow-hidden bg-white">
        
        {/* Right Panel (now shown on left) */}
        <div className="hidden md:flex w-full md:w-2/3 flex-col justify-center bg-[#3e398b] text-white p-10">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Welcome back! Please Log in to your account</h2>
            <p className="text-sm text-gray-300 mb-10">
              Log in to access the study center’s performance dashboard, explore visual analytics, and track progress with ease
            </p>

            {/* Analytics */}
            <div className="bg-white rounded-lg p-4 mb-6 text-gray-900 shadow">
              {/* <h4 className="font-semibold text-sm mb-2">Analytics</h4> */}
              <img
                src="src/image/dummyanalytic.jpg"
                alt="Analytics preview"
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Revenue */}
            {/* <div className="bg-white rounded-lg p-4 text-gray-900 shadow">
              <h4 className="font-semibold text-sm mb-1">Estimated Revenue</h4>
              <p className="text-2xl font-bold">
                $813,214 <span className="text-green-600 text-sm">▲ 1.34%</span>
              </p>
              <p className="text-xs text-gray-600">Last week’s profit: $251.45</p>
            </div> */}
          </div>
        </div>

        {/* Left Panel (now shown on right) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F3F4FF] p-10">
          <img
            src="src/image/ipb.png"
            alt="ipblogo"
            className="w-50 h-50 object-contain absolute top-30 left-[72%]"
          />
          <div className="w-full max-w-sm">
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-center mb-4">Welcome</h2>
              <GoogleLoginButton />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
