"use client";

import { useState, useEffect } from "react";

export default function FloatingDownButton() {
  const [isVisible, setIsVisible] = useState(false); // ✅ 初期値を false に設定

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight; // 画面の下端の位置
      const scrollThreshold = document.body.scrollHeight - 300; // ✅ ページの一番下から 300px 上の位置

      setIsVisible(scrollPosition < scrollThreshold); // ✅ 下部 300px 以上の位置なら表示
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // ✅ 初回実行で現在のスクロール位置を反映
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full shadow-lg w-14 h-14 text-2xl flex justify-center items-center hover:scale-110 transition-all"
      style={{
        opacity: isVisible ? 0.8 : 0, // ✅ フェードイン・フェードアウト
        transition: "opacity 0.3s ease-in-out", // ✅ スムーズなアニメーション
        pointerEvents: isVisible ? "auto" : "none", // ✅ 透明時にクリックできなくする
      }}
      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
    >
      ↓
    </button>
  );
}
