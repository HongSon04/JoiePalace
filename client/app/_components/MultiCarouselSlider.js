"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MultiCarousel = (props) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={props.autoPlay}
      keyBoardControl={true}
      showDots={false}
      removeArrowOnDeviceType={props.removeArrowOnDeviceType}
      autoPlaySpeed={props.autoPlaySpeed}
      transitionDuration={props.transitionDuration}
      customTransition={props.customTransition}
      containerClass={props.containerClass}
    >
      {props.children}
    </Carousel>
  );
};

export default MultiCarousel;
