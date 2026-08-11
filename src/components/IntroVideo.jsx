import React from "react";

export default function IntroVideo({ onFinish }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <video
        className="w-full h-full object-cover"
        src="https://media.base44.com/videos/public/6a45765641e1152e86a5def3/95f4b2ce8_PlateCraftintovideo.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
      />
      <button
        onClick={onFinish}
        className="absolute bottom-8 right-6 px-4 py-2 rounded-full bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm"
      >
        Skip
      </button>
    </div>
  );
}