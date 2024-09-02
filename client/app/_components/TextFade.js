"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TextFade = (props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: props.replayEffect });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
      variants={props.settings}
      className={props.styles}
      initial="hidden"
    >
      {props.children}
    </motion.div>
  );
};

export default TextFade;
