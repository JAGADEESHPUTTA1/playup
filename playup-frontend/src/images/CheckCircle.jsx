import { motion } from "framer-motion";

const CheckCircleAnimated = ({
  size = 80,
  color = "#208943",className=""
}) => {
  return (
    <motion.svg
      width={size}
      height={size} className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Circle + Check */}
      <motion.path
        d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM35.4,18.4l-14,14a1.9,1.9,0,0,1-2.8,0l-5.9-5.9a2.2,2.2,0,0,1-.4-2.7,2,2,0,0,1,3.1-.2L20,28.2,32.6,15.6a2,2,0,0,1,2.8,2.8Z"
        fill={color}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          pathLength: { duration: 0.6, ease: "easeInOut" },
        }}
      />
    </motion.svg>
  );
};

export default CheckCircleAnimated;
