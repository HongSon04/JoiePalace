"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TextFade = (props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: !props.replayEffect });
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasBeenViewed(true);
    } else {
      setHasBeenViewed(false);
    }
  }, [props.index, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={hasBeenViewed ? "visible" : "hidden"}
      variants={props.settings}
      className={props.styles}
      initial="hidden"
    >
      {props.children}
    </motion.div>
  );
};

export default TextFade;
