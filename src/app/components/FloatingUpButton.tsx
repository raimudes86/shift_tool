"use client";

import { useState, useEffect } from "react";

export default function FloatingUpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThresholdup = 300;
      const scrollThresholddown = document.body.scrollHeight - 300;
      setIsVisible(scrollPosition > scrollThresholdup && scrollPosition < scrollThresholddown );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // ✅ 初回実行で現在のスクロール位置を反映
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className="fixed bottom-20 right-5 bg-blue-500 text-white rounded-full shadow-lg w-14 h-14 text-2xl flex justify-center items-center hover:scale-110 transition-all"
      style={{
        opacity: isVisible ? 0.8 : 0, // ✅ フェードイン・フェードアウト
        transition: "opacity 0.3s ease-in-out", // ✅ スムーズなアニメーション
        pointerEvents: isVisible ? "auto" : "none", // ✅ 透明時はクリック不可
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
