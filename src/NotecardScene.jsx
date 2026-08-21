import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * A branded envelope in the package: the flap lifts open, the notecard
 * slides out, then a cursive line writes itself on, followed by the order no.
 *
 * Stages:
 *  idle     – sealed envelope
 *  opening  – top flap unfolds up and back
 *  rising   – the notecard slides up out of the envelope
 *  writing  – cursive "Your order is confirmed" draws left to right
 *  number   – "order #1234" fades in beneath
 *  gone     – settled; onArrived fires
 */
export default function NotecardScene({ onArrived, standalone = false }) {
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setStage("opening"), 600));
    timers.push(setTimeout(() => setStage("rising"), 1650));
    timers.push(setTimeout(() => setStage("writing"), 2650));
    timers.push(setTimeout(() => setStage("number"), 4350));
    timers.push(setTimeout(() => setStage("gone"), 5050));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "gone") onArrived?.();
  }, [stage, onArrived]);

  const flapOpen = stage !== "idle";
  const cardOut = ["rising", "writing", "number", "gone"].includes(stage);
  const writeOn = ["writing", "number", "gone"].includes(stage);
  const numberOn = ["number", "gone"].includes(stage);

  return (
    <div
      className={
        "relative flex w-full items-center justify-center bg-gradient-to-b from-white to-neutral-100 " +
        (standalone
          ? "min-h-[80vh] py-40"
          : "aspect-[23/12] overflow-hidden")
      }
    >
      <div
        className="relative"
        style={{
          perspective: 1600,
          width: standalone ? "min(46%, 340px)" : "min(58%, 300px)",
          aspectRatio: "1 / 0.9",
        }}
      >
        {/* ground shadow */}
        <motion.div
          className="absolute inset-x-6 bottom-0 h-4 rounded-[50%] bg-neutral-900/15 blur-md"
          animate={{ scaleX: cardOut ? 1.06 : 1, opacity: cardOut ? 0.9 : 0.7 }}
          transition={{ duration: 0.6 }}
        />

        {/* ===== envelope interior (the shaded inside, revealed once open) =====
            Full body behind everything; the open top-triangle shows this. */}
        <div
          className="absolute inset-0 z-[10] rounded-[8px] bg-gradient-to-b from-neutral-200/80 via-neutral-100 to-white ring-1 ring-neutral-200 shadow-[inset_0_26px_30px_-18px_rgba(0,0,0,0.30)]"
        />

        {/* ===== the notecard (slides up out of the envelope) ===== */}
        <motion.div
          className="absolute left-1/2 z-[30] flex flex-col items-center justify-center rounded-[3px] bg-white ring-1 ring-neutral-200"
          style={{
            width: "78%",
            height: "64%",
            top: "34%",
            x: "-50%",
            transformOrigin: "center bottom",
            containerType: "inline-size",
          }}
          initial={false}
          animate={{
            y: cardOut ? "-92%" : "10%",
            opacity: cardOut ? 1 : 0,
            boxShadow: cardOut
              ? "0 24px 40px -18px rgba(0,0,0,0.35)"
              : "0 2px 6px -4px rgba(0,0,0,0.2)",
          }}
          transition={{
            y: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.25 },
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}baggallini-logo.png`}
            alt="baggallini"
            className="mb-5 h-3.5 w-auto opacity-90"
          />

          {/* cursive line drawn left to right */}
          <motion.p
            className="px-4 py-1 text-center text-neutral-900"
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: "clamp(20px, 13cqw, 40px)",
              lineHeight: 1.5,
            }}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: writeOn ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
            transition={{ duration: 1.7, ease: [0.42, 0, 0.4, 1] }}
          >
            Your order is confirmed
          </motion.p>

          {/* order number beneath */}
          <motion.p
            className="mt-4 text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: numberOn ? 1 : 0, y: numberOn ? 0 : 6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            order #1234
          </motion.p>
        </motion.div>

        {/* ===== front pocket: left + right + bottom flaps meeting at center C =====
            Covers the whole front EXCEPT the top-center triangle (apex down at C),
            which is where the top flap seats when closed / the interior shows when open. */}
        <div className="absolute inset-0 z-20">
          {/* left flap */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-white"
            style={{ clipPath: "polygon(0 0, 0 100%, 50% 58%)" }}
          />
          {/* right flap (a touch darker for form) */}
          <div
            className="absolute inset-0 bg-gradient-to-l from-neutral-200/70 to-white"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 58%)" }}
          />
          {/* bottom flap, front-most so the card tucks behind it */}
          <div
            className="absolute inset-0 rounded-b-[8px] bg-gradient-to-t from-neutral-100 to-white"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 58%)" }}
          />
          {/* seam shadows radiating from the center point C */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: "polygon(50% 58%, 100% 100%, 98.5% 100%, 50% 59%)", background: "rgba(0,0,0,0.12)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: "polygon(50% 58%, 0 100%, 1.5% 100%, 50% 59%)", background: "rgba(0,0,0,0.08)" }}
          />
          {/* subtle outer frame */}
          <div className="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-neutral-200" />
        </div>

        {/* ===== top flap: hinged at the TOP edge — points down (closed) → folds up (open) =====
            closed = rotateX(0)   → triangle apex-down, seated in the front (sealed)
            open   = rotateX(180) → flap folds up & back, apex points UP above the body */}
        <motion.div
          className="absolute left-0 top-0"
          style={{
            width: "100%",
            height: "58%",
            transformOrigin: "50% 0%",
            transformStyle: "preserve-3d",
            zIndex: flapOpen ? 11 : 40,
          }}
          initial={false}
          animate={{ rotateX: flapOpen ? 178 : 0 }}
          transition={{ duration: 0.95, ease: [0.34, 1.06, 0.5, 1] }}
        >
          {/* single flap face — white with soft shading, reads as paper from both
              sides. Closed: apex down, sealed. Open (rotateX 178° about the top
              hinge): the triangle swings up & back, apex pointing UP above the body.
              A drop-shadow along the silhouette seats it above the front when closed. */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-neutral-200"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.12))",
            }}
          />
          {/* crisp seam highlight running down the two flap edges to the apex */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              clipPath:
                "polygon(0 0, 1.5% 0, 50% 97%, 100% 0, 98.5% 0, 50% 100%, 50% 100%)",
              background: "rgba(0,0,0,0.10)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
