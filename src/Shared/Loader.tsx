import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className=" h-screen w-full flex items-center justify-center absolute bg-[#00000066] top-0 left-0  ">
      <div className="flex justify-center items-center h-full w-full">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default Loader;
