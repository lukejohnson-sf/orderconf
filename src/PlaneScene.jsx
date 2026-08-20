import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * Parcels load into a cargo plane, which then taxis and takes off.
 * Same monochrome, thin-stroke base as the truck scene.
 *
 * Stages:
 *  idle     – plane waits on the tarmac, parcels queued at left
 *  loading  – cargo door opens, parcels slide in one by one
 *  ready    – door closes, engines settle
 *  takeoff  – plane accelerates, rotates nose-up and climbs off-frame
 *  gone     – off-screen; the area settles into a static confirmation
 */
export default function PlaneScene({ onArrived }) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("loading"), 800));
    timers.push(setTimeout(() => setStage("ready"), 2600));
    timers.push(setTimeout(() => setStage("takeoff"), 3100));
    timers.push(setTimeout(() => setStage("gone"), 5200));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "gone") onArrived?.();
  }, [stage, onArrived]);

  const loaded = stage !== "idle";
  const doorOpen = stage === "loading";
  const takingOff = stage === "takeoff" || stage === "gone";
  const inMotion = stage === "takeoff";
  const gone = stage === "gone";

  const INK = "#111111";

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white to-neutral-100">
      <svg
        viewBox="0 0 460 240"
        className="relative z-10 w-full"
        role="img"
        aria-label="Parcels loading onto a cargo plane that takes off"
      >
        {/* ---- tarmac hairline ---- */}
        <line x1="0" y1="212" x2="460" y2="212" stroke={INK} strokeWidth="1.25" />
        {/* runway ticks that streak during takeoff, then fade */}
        <motion.g animate={{ opacity: gone ? 0 : 0.28 }} transition={{ duration: 0.5 }}>
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
                  ? { duration: 0.4, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3 }
              }
            />
          ))}
        </motion.g>

        {/* ---- queued parcels that slide into the hold ---- */}
        {[
          { start: 18, delay: 0 },
          { start: 44, delay: 0.4 },
          { start: 70, delay: 0.8 },
        ].map(({ start, delay }) => (
          <motion.g
            key={start}
            initial={false}
            animate={
              loaded
                ? { x: 150 - start, opacity: [1, 1, 0] }
                : { x: 0, opacity: 1 }
            }
            transition={
              loaded
                ? { duration: 0.7, delay, ease: "easeIn", times: [0, 0.75, 1] }
                : { duration: 0.3 }
            }
          >
            <rect
              x={start}
              y="196"
              width="15"
              height="15"
              fill="#ffffff"
              stroke={INK}
              strokeWidth="1.25"
            />
            <line
              x1={start + 7.5}
              y1="196"
              x2={start + 7.5}
              y2="211"
              stroke={INK}
              strokeWidth="0.75"
              opacity="0.5"
            />
          </motion.g>
        ))}

        {/* ---- the whole aircraft ---- */}
        <motion.g
          animate={{
            x: takingOff ? 620 : 0,
            y: takingOff ? -300 : 0,
            rotate: takingOff ? -12 : 0,
          }}
          transition={
            takingOff
              ? { duration: 2.1, ease: [0.5, 0, 0.85, 1] }
              : { duration: 0.3 }
          }
          style={{ transformOrigin: "230px 180px" }}
        >
          {/* tail fin */}
          <path d="M118 156 L104 122 L150 155 Z" fill={INK} />
          {/* rear horizontal stabiliser */}
          <path d="M112 158 L92 150 L120 162 Z" fill={INK} opacity="0.85" />

          {/* fuselage */}
          <path
            d="M120 178 Q120 152 152 152 H298 Q334 152 344 174 Q334 196 300 196 H150 Q120 196 120 178 Z"
            fill="#ffffff"
            stroke={INK}
            strokeWidth="1.5"
          />

          {/* cockpit windshield near nose */}
          <path d="M320 164 q12 2 15 9 l-15 0 z" fill={INK} opacity="0.9" />
          {/* cabin windows */}
          {[168, 182, 196, 210, 224, 238, 252, 266].map((cx) => (
            <circle key={cx} cx={cx} cy="168" r="2.2" fill={INK} opacity="0.55" />
          ))}

          {/* cargo door (opens while loading) */}
          <motion.rect
            x="138"
            y="176"
            width="26"
            height="18"
            rx="2"
            fill="#ffffff"
            stroke={INK}
            strokeWidth="1.25"
            initial={false}
            animate={{ rotate: doorOpen ? -105 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "138px 176px" }}
          />

          {/* wing sweeping down + engine pod */}
          <path d="M214 190 H262 L242 216 H206 Z" fill={INK} opacity="0.9" />
          <rect x="220" y="206" width="26" height="9" rx="4.5" fill={INK} />
          <circle cx="221" cy="210.5" r="3.5" fill="#ffffff" opacity="0.85" />

          {/* landing gear (retracts on takeoff) */}
          {[186, 296].map((cx) => (
            <motion.g
              key={cx}
              initial={false}
              animate={{ opacity: takingOff ? 0 : 1, y: takingOff ? -8 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <line x1={cx} y1="196" x2={cx} y2="207" stroke={INK} strokeWidth="1.5" />
              <circle cx={cx} cy="209" r="4" fill={INK} />
            </motion.g>
          ))}
        </motion.g>
      </svg>

      {/* static confirmation once the plane has gone */}
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
    </div>
  );
}
