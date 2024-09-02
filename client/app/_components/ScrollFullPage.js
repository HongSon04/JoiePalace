"use client";
import { useEffect } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.css";

const ScrollFullPage = ({ children }) => {
  useEffect(() => {
    const textElements = document.querySelectorAll('.text-fade-in');
    const textElementsLefttoRight = document.querySelectorAll('.text-left-to-right');
    new fullpage("#fullpage", {
      autoScrolling: true,
      scrollHorizontally: true,
      scrollingSpeed: 1500,
      easingcss3: "cubic-bezier(0.8, 0, 0.1, 1)",
      onLeave: function (origin, destination, direction) {

        if (textElements) {// Hiệu ứng từ dưới hiện lên
          textElements.forEach(i => {
            i.classList.remove('text-fade-in');
            i.classList.add('text-fade-out');
          });
        }
        if (textElementsLefttoRight) {// hiệu ứng chạy từ trái sang
          textElementsLefttoRight.forEach(i => {
            i.classList.remove('text-left-to-right');
            i.classList.add('text-left-to-right-out');
          });
        }
      },
      afterLoad: function (origin, destination, direction) {
        if (textElements) {
          textElements.forEach(i => {
            i.classList.remove('text-fade-out');
            i.classList.add('text-fade-in');
          });
        }
        if (textElementsLefttoRight) {
          textElementsLefttoRight.forEach(i => {
            i.classList.remove('text-left-to-right-out');
            i.classList.add('text-left-to-right');
          });
        }
      },
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