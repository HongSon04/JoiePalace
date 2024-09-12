"use client";
import { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MultiCarousel = (props) => {
  const carouselRef = useRef();
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
      keyBoardControl={true}
      autoPlay={props.autoPlay}
      showDots={false}
      ref={carouselRef}
      {...props}
    >
      {props.customButtons ? props.children(carouselRef) : props.children}
    </Carousel>
  );
};

export default MultiCarousel;
