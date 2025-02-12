"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TextFade = ({ replayEffect, ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: !replayEffect });
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
      {...props}
    >
      {props.children}
    </motion.div>
  );
};

export default TextFade;
