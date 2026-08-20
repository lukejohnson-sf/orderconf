import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * A parcel that assembles into a delivery truck and drives off-screen.
 * Monochrome, thin-stroke treatment for an elevated brand.
 *
 * Stages:
 *  idle       – the parcel rests on the road, gently bobbing
 *  assembling – wheels drop in, the cab extends out the front
 *  revving    – a quiet suspension settle + headlight glow
 *  driving    – wheels spin, the vehicle glides off to the right
 *  gone       – off-screen; caller can show a follow-up message
 */
export default function TruckScene({ onArrived }) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("assembling"), 800));
    timers.push(setTimeout(() => setStage("revving"), 2300));
    timers.push(setTimeout(() => setStage("driving"), 3000));
    timers.push(setTimeout(() => setStage("gone"), 5100));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "gone") onArrived?.();
  }, [stage, onArrived]);

  const assembled = stage !== "idle";
  const driveOff = stage === "driving" || stage === "gone"; // truck stays off-screen
  const inMotion = stage === "driving"; // looping motion only while actively driving
  const gone = stage === "gone";

  const INK = "#111111";
  const LINE = "#111111";

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white to-neutral-100">
      <svg
        viewBox="0 0 460 240"
        className="relative z-10 w-full"
        role="img"
        aria-label="A parcel becoming a delivery truck and driving away"
      >
        {/* ---- road: a single hairline instead of asphalt ---- */}
        <line x1="0" y1="212" x2="460" y2="212" stroke={INK} strokeWidth="1.25" />
        {/* faint lane ticks that streak while driving, then settle & fade once gone */}
        <motion.g
          animate={{ opacity: gone ? 0 : 0.28 }}
          transition={{ duration: 0.5 }}
        >
          {[30, 120, 210, 300, 390].map((x) => (
            <motion.rect
              key={x}
              x={x}
              y="222"
              width="34"
              height="1.5"
              fill={INK}
              animate={inMotion ? { x: [x, x - 90] } : { x }}
              transition={
                inMotion
                  ? { duration: 0.5, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3 }
              }
            />
          ))}
        </motion.g>

        {/* ---- the whole vehicle ---- */}
        <motion.g
          animate={{
            x: driveOff ? 560 : 0,
            y: inMotion ? [0, -1.5, 0, -1.5, 0] : 0,
          }}
          transition={
            driveOff
              ? {
                  x: { duration: 2.0, ease: [0.45, 0, 0.9, 1] },
                  y: { duration: 0.3, repeat: Infinity, ease: "easeInOut" },
                }
              : { duration: 0.3 }
          }
        >
          {/* idle bob for the pre-assembly parts */}
          <motion.g
            animate={stage === "idle" ? { y: [0, -5, 0] } : { y: 0 }}
            transition={
              stage === "idle"
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          >
            {/* ===== CAB ===== */}
            <motion.g
              initial={false}
              animate={{ scaleX: assembled ? 1 : 0, opacity: assembled ? 1 : 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "250px 150px" }}
            >
              {/* cab body — solid ink */}
              <path
                d="M250 120 h42 a8 8 0 0 1 7 4 l16 32 a10 10 0 0 1 1 4 v48 h-73 z"
                fill={INK}
              />
              {/* windshield */}
              <path d="M296 126 l11 26 h-22 v-26 z" fill="#f5f5f4" opacity="0.92" />
              {/* headlight */}
              <motion.circle
                cx="313"
                cy="190"
                r="3.5"
                fill="#ffffff"
                animate={
                  stage === "revving"
                    ? { opacity: [0.4, 1, 0.5, 1] }
                    : { opacity: driveOff ? 1 : 0.55 }
                }
                transition={{ duration: 0.5 }}
              />
            </motion.g>

            {/* ===== PARCEL / cargo — starts life as the box ===== */}
            <g>
              <rect
                x="120"
                y="118"
                width="130"
                height="94"
                fill="#ffffff"
                stroke={LINE}
                strokeWidth="1.5"
              />
              {/* flap seam */}
              <line x1="185" y1="118" x2="185" y2="165" stroke={LINE} strokeWidth="1" />
              <line
                x1="120"
                y1="165"
                x2="250"
                y2="165"
                stroke={LINE}
                strokeWidth="1"
                opacity="0.55"
              />
              {/* single restrained tape band */}
              <line x1="185" y1="118" x2="185" y2="212" stroke={LINE} strokeWidth="6" opacity="0.06" />

              {/* minimal wordmark on the parcel once assembled */}
              <motion.g
                initial={false}
                animate={{ opacity: assembled ? 1 : 0 }}
                transition={{ duration: 0.5, delay: assembled ? 0.35 : 0 }}
              >
                <image
                  href="/baggallini-logo.png"
                  x="144"
                  y="180"
                  width="82"
                  height="18"
                  preserveAspectRatio="xMidYMid meet"
                />
              </motion.g>
            </g>

            {/* ===== WHEELS ===== */}
            {[
              { cx: 150, delay: 0 },
              { cx: 214, delay: 0.09 },
              { cx: 298, delay: 0.18 },
            ].map(({ cx, delay }) => (
              <motion.g
                key={cx}
                initial={false}
                animate={{ y: assembled ? 0 : 36, opacity: assembled ? 1 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  delay: assembled ? delay : 0,
                }}
              >
                <circle cx={cx} cy="212" r="17" fill={INK} />
                <g
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: inMotion ? "wheel-spin 0.4s linear infinite" : "none",
                  }}
                >
                  <circle cx={cx} cy="212" r="6" fill="none" stroke="#ffffff" strokeWidth="1.25" />
                  <line x1={cx} y1="200" x2={cx} y2="224" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
                  <line x1={cx - 12} y1="212" x2={cx + 12} y2="212" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
                </g>
              </motion.g>
            ))}
          </motion.g>

          {/* ===== exhaust — a faint grey wisp ===== */}
          {inMotion &&
            [0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="112"
                cy="196"
                r="5"
                fill="#9ca3af"
                initial={{ opacity: 0.35, scale: 0.5, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 1.7, x: -36, y: -8 }}
                transition={{
                  duration: 1.0,
                  repeat: Infinity,
                  delay: i * 0.28,
                  ease: "easeOut",
                }}
              />
            ))}
        </motion.g>
      </svg>

      {/* once the truck has left, the area settles into a static confirmation */}
      {gone && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <motion.svg
            viewBox="0 0 24 24"
            className="mb-3 h-6 w-6"
            fill="none"
            stroke="#111111"
            strokeWidth="1.75"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <motion.path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />
          </motion.svg>
          <motion.p
            className="font-serif text-2xl text-neutral-900"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Your order is confirmed
          </motion.p>
        </div>
      )}

      <style>{`
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
