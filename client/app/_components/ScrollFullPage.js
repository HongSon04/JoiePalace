"use client";
import { useEffect } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css";

const ScrollFullPage = ({ children }) => {
  useEffect(() => {
    new fullpage("#fullpage", {
      licenseKey: "null",
      autoScrolling: true,
      scrollHorizontally: true,
      scrollingSpeed: 1500,
      easingcss3: "cubic-bezier(0.6, 0, 0.2, 1)",
    });
    return () => {
      if (window.fullpage_api) {
        window.fullpage_api.destroy("all");
      }
    };
  }, []);
  return (
    <div id="fullpage" className="fullpage-container">
      {children}
    </div>
  );
};

export default ScrollFullPage;
