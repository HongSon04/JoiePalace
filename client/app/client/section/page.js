"use client";
import MultiCarousel from "@/app/_components/MultiCarouselSlider";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
const test = () => {
  return (
    <ScrollFullPage>
      <section className="section">
        <MultiCarousel
          autoPlaySpeed={3000}
          transitionDuration={7000}
          customTransition="transform 7000ms ease-in-out"
        >
          <div className="w-screen h-screen bg-black"></div>
          <div className="w-screen h-screen bg-yellow-500"></div>
          <div className="w-screen h-screen bg-pink-500"></div>
        </MultiCarousel>
      </section>
    </ScrollFullPage>
  );
};

export default test;
