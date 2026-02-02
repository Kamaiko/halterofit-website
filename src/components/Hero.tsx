import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function Hero() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  const nameWords = t("hero.name").split(" ");
  const nameDelay = 0.3 + nameWords.length * 0.12 + 0.3;

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Animated mesh gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.07] blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -20, 25, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.04] blur-[80px]"
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative max-w-4xl text-center">
        {/* Greeting */}
        <motion.p
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={lineVariants}
          className="mb-6 text-sm font-medium tracking-[0.3em] text-cyan-400 uppercase"
        >
          {t("hero.greeting")}
        </motion.p>

        {/* Name — word by word reveal with blur */}
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
          {nameWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="mr-[0.3em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Title with gradient */}
        <motion.p
          custom={nameDelay}
          initial="hidden"
          animate="visible"
          variants={lineVariants}
          className="mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-xl font-medium text-transparent md:text-2xl"
        >
          {t("hero.title")}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          custom={nameDelay + 0.2}
          initial="hidden"
          animate="visible"
          variants={lineVariants}
          className="mx-auto max-w-xl text-slate-400"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Scroll indicator — mouse icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: nameDelay + 1, duration: 1 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <div className="relative flex flex-col items-center gap-1">
            {/* Animated chevrons */}
            {[0, 1, 2].map((i) => (
              <motion.svg
                key={i}
                width="16"
                height="8"
                viewBox="0 0 16 8"
                fill="none"
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [0, 6, 12],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25,
                }}
              >
                <path
                  d="M1 1L8 6L15 1"
                  stroke="rgba(34,211,238,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
