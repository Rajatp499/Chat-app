import { motion } from "framer-motion";

// 1. Spinner Loading (Simple & Clean)
export const SpinnerLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-dark">
      <motion.div
        className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// 2. Dots Loading (Animated Dots)
export const DotsLoading = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -20 },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-primary rounded-full"
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 3. Pulse Loading (Expanding Circle)
export const PulseLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-dark">
      <div className="relative">
        <motion.div
          className="w-20 h-20 bg-secondary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 w-20 h-20 bg-secondary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

// 4. Branded Loading (With Logo & Text)
export const BrandedLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark">
      {/* Logo Container */}
      <motion.div
        className="mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
          <span className="text-4xl font-bold text-white">LG</span>
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.h2
        className="text-2xl font-bold text-white mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        LegalGPT Nepal
      </motion.h2>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-gray-400 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

// 5. Bar Loading (Vertical Bars)
export const BarLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-dark">
      <div className="flex space-x-2 items-end h-16">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-2 bg-secondary rounded-full"
            animate={{
              height: ["20%", "100%", "20%"],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// 6. Scale Loading (Legal Scales Animation)
export const ScaleLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark">
      <motion.div
        className="text-6xl mb-4"
        animate={{
          rotate: [-10, 10, -10],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ⚖️
      </motion.div>
      <motion.p
        className="text-white text-lg font-semibold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        Preparing Legal Assistance...
      </motion.p>
    </div>
  );
};
