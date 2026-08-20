import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * A branded bag whose top zipper is pulled open — the lid lifts and the order
 * confirmation card rises up out of the bag. Same monochrome, elevated feel.
 *
 * Stages:
 *  idle       – closed bag, the pull resting at the left
 *  unzipping  – the pull glides right; the teeth part behind it
 *  opening    – the top lid lifts open on its hinge
 *  reveal     – the confirmation card rises up out of the bag
 *  gone        – settled; onArrived fires
 */
export default function ZipperScene({ onArrived, standalone = false }) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("unzipping"), 700));
    timers.push(setTimeout(() => setStage("opening"), 2500));
    timers.push(setTimeout(() => setStage("reveal"), 3150));
    timers.push(setTimeout(() => setStage("gone"), 5000));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "gone") onArrived?.();
  }, [stage, onArrived]);

  const unzipped = stage !== "idle";
  const lidOpen = ["opening", "reveal", "gone"].includes(stage);
  const revealed = ["reveal", "gone"].includes(stage);

  // how far the pull has travelled across the zip line (% of the track)
  const pull = unzipped ? 90 : 8;

  const INK = "#111111";

  return (
    <div
      className={
        "relative flex w-full items-center justify-center bg-gradient-to-b from-white to-neutral-100 " +
        (standalone ? "min-h-[80vh] py-40" : "aspect-[23/12] overflow-hidden")
      }
    >
      {/* ===== the bag ===== */}
      <div
        className="relative"
        style={{
          width: standalone ? "min(42%, 320px)" : "min(50%, 300px)",
          aspectRatio: "1 / 0.94",
          perspective: 1400,
        }}
      >
        {/* handle loop */}
        <svg
          className="absolute left-1/2 bottom-full h-[30%] w-[58%] -translate-x-1/2 overflow-visible"
          viewBox="0 0 100 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M6 60 Q 50 -14 94 60"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* the confirmation card — rises up out of the bag */}
        <motion.div
          className="absolute left-1/2 z-[15] flex flex-col items-center justify-center rounded-[4px] bg-white px-4 text-center ring-1 ring-neutral-300"
          style={{ width: "78%", height: "60%", top: "20%", x: "-50%", transformOrigin: "center bottom", containerType: "inline-size" }}
          initial={false}
          animate={{
            y: revealed ? "-80%" : "8%",
            opacity: revealed ? 1 : 0,
            boxShadow: revealed
              ? "0 24px 38px -18px rgba(0,0,0,0.35)"
              : "0 2px 6px -4px rgba(0,0,0,0.2)",
          }}
          transition={{ y: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 } }}
        >
          <svg viewBox="0 0 24 24" className="mb-2 h-5 w-5" fill="none" stroke={INK} strokeWidth="1.75">
            <motion.path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: revealed ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            />
          </svg>
          <p className="font-serif text-neutral-900" style={{ fontSize: "clamp(13px, 9cqw, 22px)", lineHeight: 1.15 }}>
            Your order is confirmed
          </p>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
            order #1234
          </p>
        </motion.div>

        {/* dark mouth that appears once the zip parts (the card emerges from here) */}
        <motion.div
          className="absolute inset-x-[7%] z-[12] rounded-[3px] bg-gradient-to-b from-neutral-900 to-neutral-700"
          style={{ top: "22%", height: "10%", transformOrigin: "center top" }}
          initial={false}
          animate={{ scaleY: lidOpen ? 1 : 0, opacity: lidOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* bag front (below the zip line) — the card tucks behind this while inside */}
        <div className="absolute inset-x-0 bottom-0 top-[26%] z-20 rounded-b-[22px] bg-gradient-to-b from-white to-neutral-100 ring-1 ring-neutral-200" />
        {/* faint vertical seam + soft form shading on the front */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[26%] z-20 rounded-b-[22px] bg-gradient-to-r from-neutral-200/40 via-transparent to-neutral-200/40" />

        {/* ===== top lid (above the zip line) — lifts open on its hinge ===== */}
        <motion.div
          className="absolute inset-x-0 top-0 origin-bottom"
          style={{ height: "26%", transformStyle: "preserve-3d", zIndex: lidOpen ? 8 : 30 }}
          initial={false}
          animate={{ rotateX: lidOpen ? -125 : 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.04, 0.5, 1] }}
        >
          <div className="absolute inset-0 rounded-t-[22px] bg-gradient-to-b from-white to-neutral-100 ring-1 ring-neutral-200" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-200/60 to-transparent" />
        </motion.div>

        {/* ===== zipper track sitting on the zip line ===== */}
        <div className="absolute inset-x-[7%] z-[25]" style={{ top: "calc(26% - 5px)", height: 10 }}>
          {/* parted tapes to the LEFT of the pull */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pull}% 0 0)` }}>
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-neutral-300" />
            <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-neutral-300" />
          </div>
          {/* closed, interlocked teeth to the RIGHT of the pull */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pull}%)` }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: INK,
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 4px)",
              }}
            />
          </div>
        </div>

        {/* ===== the pull / slider ===== */}
        <motion.div
          className="absolute z-[26]"
          style={{ top: "calc(26% - 9px)" }}
          initial={false}
          animate={{ left: `calc(7% + ${pull}% * 0.86)` }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.3, 1] }}
        >
          <div className="h-[18px] w-[13px] -translate-x-1/2 rounded-[3px] bg-gradient-to-b from-neutral-600 to-neutral-900 shadow-sm" />
          <div className="mx-auto mt-[1px] h-[9px] w-[7px] rounded-b-[3px] border border-neutral-700 bg-neutral-500" />
        </motion.div>
      </div>
    </div>
  );
}
