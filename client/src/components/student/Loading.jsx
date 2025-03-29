import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div
        className="w-16 sm:w-20 aspect-square border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"
        style={{
          animationDuration: "1.2s",
        }}
        aria-live="polite"
        role="status"
      ></div>
      <p className="text-xl font-semibold text-gray-700 mt-4">Loading...</p>
    </div>
  );
};

export default Loading;
