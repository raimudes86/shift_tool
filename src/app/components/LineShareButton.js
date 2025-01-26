import React from "react";

const LineShareButton = ({ text }) => {
  const shareToLINE = () => {
    const encodedText = encodeURIComponent(text);
    const lineShareUrl = `https://line.me/R/share?text=${encodedText}`;
    window.open(lineShareUrl, "_blank"); // 新しいタブで開く
  };

  return (
    <button
      onClick={shareToLINE}
      style={{
        padding: "10px 20px",
        backgroundColor: "#00C300",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      LINEで共有
    </button>
  );
};

export default LineShareButton;
