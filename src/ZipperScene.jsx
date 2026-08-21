import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * A large zipper running down the centre of the page. The pull glides down,
 * the two panels part in a widening V behind it, then slide away to reveal the
 * order confirmation printed directly on the surface underneath.
 *
 * Stages:
 *  idle       – closed, the pull resting at the top
 *  unzipping  – the pull travels down; the panels part in a V behind it
 *  opening    – the parted panels slide fully away to the sides
 *  reveal     – the confirmation settles in (checkmark draws, copy rises)
 *  gone        – settled; onArrived fires
 */
export default function ZipperScene({ onArrived, standalone = false }) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("unzipping"), 600));
    timers.push(setTimeout(() => setStage("opening"), 2300));
    timers.push(setTimeout(() => setStage("reveal"), 2850));
    timers.push(setTimeout(() => setStage("gone"), 4700));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "gone") onArrived?.();
  }, [stage, onArrived]);

  const unzipped = stage !== "idle";
  const parted = ["opening", "reveal", "gone"].includes(stage);
  const revealed = ["reveal", "gone"].includes(stage);

  const INK = "#111111";

  // clip paths: the inner edge converges to the pull (apex), open above it.
  const leftClosed = "polygon(0% 0%, 50% 0%, 50% 0%, 50% 100%, 0% 100%)";
  const leftOpen = "polygon(0% 0%, 24% 0%, 50% 100%, 50% 100%, 0% 100%)";
  const rightClosed = "polygon(100% 0%, 50% 0%, 50% 0%, 50% 100%, 100% 100%)";
  const rightOpen = "polygon(100% 0%, 76% 0%, 50% 100%, 50% 100%, 100% 100%)";

  // the pull travels top→bottom in step with the parting; shared easing keeps
  // the V apex pinned to the pull.
  const track = { duration: 1.5, ease: [0.4, 0, 0.3, 1] };
  const slide = { duration: 0.6, ease: [0.5, 0, 0.2, 1] };

  return (
    <div
      className={
        "relative flex w-full items-center justify-center bg-gradient-to-b from-white to-neutral-100 " +
        (standalone ? "min-h-[80vh] py-16" : "aspect-[23/12] overflow-hidden")
      }
    >
      {/* the surface being unzipped */}
      <div
        className="relative overflow-hidden rounded-[10px] bg-white ring-1 ring-neutral-200 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
        style={{ width: standalone ? "min(72%, 420px)" : "min(60%, 320px)", aspectRatio: "3 / 4" }}
      >
        {/* ===== confirmation printed on the surface (revealed) ===== */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center px-8 text-center">
          <div className="relative h-12 w-12">
            <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
              <motion.circle
                cx="24"
                cy="24"
                r="23"
                stroke={INK}
                strokeWidth="1.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: revealed ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformOrigin: "center", rotate: "-90deg" }}
              />
              <motion.path
                d="M15 24.5l6 6L34 17"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: revealed ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
          </div>
          <motion.p
            className="mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-400"
            initial={{ opacity: 0, y: 8 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Order Confirmed
          </motion.p>
          <motion.h2
            className="mt-3 font-serif text-3xl font-normal leading-tight text-neutral-900 sm:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Your order is confirmed
          </motion.h2>
          <motion.p
            className="mt-4 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            Order No. <span className="text-neutral-800">AT-4827193</span>
          </motion.p>
        </div>

        {/* ===== left cover panel ===== */}
        <motion.div
          className="absolute inset-0 z-20 bg-gradient-to-br from-neutral-800 to-neutral-950"
          initial={false}
          animate={{
            clipPath: unzipped ? leftOpen : leftClosed,
            x: parted ? "-80%" : "0%",
            opacity: parted ? 0 : 1,
          }}
          transition={{ clipPath: track, x: slide, opacity: slide }}
        >
          {/* inner-edge sheen along the closure */}
          <div className="absolute inset-y-0 right-0 w-px bg-white/25" />
        </motion.div>

        {/* ===== right cover panel ===== */}
        <motion.div
          className="absolute inset-0 z-20 bg-gradient-to-bl from-neutral-800 to-neutral-950"
          initial={false}
          animate={{
            clipPath: unzipped ? rightOpen : rightClosed,
            x: parted ? "80%" : "0%",
            opacity: parted ? 0 : 1,
          }}
          transition={{ clipPath: track, x: slide, opacity: slide }}
        >
          <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
        </motion.div>

        {/* ===== zipper teeth on the still-closed part (below the pull) ===== */}
        <motion.div
          className="absolute left-1/2 top-0 z-30 h-full w-[12px] -translate-x-1/2"
          initial={false}
          animate={{ clipPath: unzipped ? "inset(100% 0 0 0)" : "inset(0 0 0 0)", opacity: parted ? 0 : 1 }}
          transition={{ clipPath: track, opacity: slide }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundColor: "#e5e5e5",
              backgroundImage:
                "repeating-linear-gradient(180deg, #d4d4d4 0 2px, transparent 2px 5px)",
            }}
          />
          {/* centre channel */}
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-neutral-500/60" />
        </motion.div>

        {/* ===== the pull / slider ===== */}
        <motion.div
          className="absolute left-1/2 z-40 -translate-x-1/2"
          initial={false}
          animate={{ top: unzipped ? "94%" : "3%", opacity: parted ? 0 : 1 }}
          transition={{ top: track, opacity: slide }}
        >
          {/* slider body */}
          <div className="h-[26px] w-[20px] rounded-[4px] bg-gradient-to-b from-neutral-300 to-neutral-500 shadow-md ring-1 ring-neutral-600/40" />
          {/* pull tab hanging below */}
          <div className="mx-auto -mt-[2px] h-3 w-[9px] rounded-b-[4px] border border-neutral-500 bg-neutral-300" />
        </motion.div>
      </div>
    </div>
  );
}
