import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import TruckScene from "./TruckScene.jsx";
import PlaneScene from "./PlaneScene.jsx";
import NotecardScene from "./NotecardScene.jsx";

const SCENES = {
  truck: { label: "Truck", Component: TruckScene },
  plane: { label: "Plane", Component: PlaneScene },
  notecard: { label: "Notecard", Component: NotecardScene },
};

const ORDER = {
  number: "AT-4827193",
  eta: "Friday, 22 August",
  items: [
    { name: "Trailhead Runner — Slate", qty: 1, price: 128.0 },
    { name: "Merino Crew Sock — Three-pack", qty: 1, price: 24.0 },
  ],
  shipping: 0,
};

const fmt = (n) => (n === 0 ? "Complimentary" : `$${n.toFixed(2)}`);

export default function App() {
  const [runId, setRunId] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [variant, setVariant] = useState("truck");

  const replay = useCallback(() => {
    setArrived(false);
    setRunId((n) => n + 1);
  }, []);

  const selectVariant = useCallback((next) => {
    setVariant(next);
    setArrived(false);
    setRunId((n) => n + 1);
  }, []);

  const Scene = SCENES[variant].Component;

  const subtotal = ORDER.items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + ORDER.shipping;

  const toggle = (
    <div className="inline-flex gap-1 rounded-full border border-neutral-200 bg-white p-1">
      {Object.entries(SCENES).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => selectVariant(key)}
          className={
            "rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] transition " +
            (variant === key
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:text-neutral-900")
          }
        >
          {label}
        </button>
      ))}
    </div>
  );

  // The notecard gets a dedicated full page so the raised card never crops.
  if (variant === "notecard") {
    return (
      <div className="flex min-h-full flex-col items-center bg-neutral-100 px-4 py-8">
        <div className="mb-2 flex justify-center">{toggle}</div>
        <div className="flex w-full max-w-3xl flex-1 items-center justify-center">
          <NotecardScene key={variant + "-" + runId} standalone onArrived={() => setArrived(true)} />
        </div>
        <button
          onClick={replay}
          className="mt-2 rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-600 transition hover:bg-neutral-50"
        >
          Replay
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-neutral-100 p-4 sm:p-10">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg border border-neutral-200 bg-white"
      >
        {/* header */}
        <div className="flex flex-col items-center px-10 pt-12 text-center">
          <div className="relative h-12 w-12">
            {/* expanding confirmation ping */}
            <motion.span
              className="absolute inset-0 rounded-full border border-neutral-900"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.7], opacity: [0, 0.35, 0] }}
              transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
            />
            <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
              {/* ring draws itself in */}
              <motion.circle
                cx="24"
                cy="24"
                r="23"
                stroke="#111111"
                strokeWidth="1.25"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.25, ease: "easeInOut" }}
                style={{ transformOrigin: "center" }}
              />
              {/* check draws, then settles with a tiny pop */}
              <motion.path
                d="M15 24.5l6 6L34 17"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, scale: [1, 1.12, 1] }}
                transition={{
                  pathLength: { duration: 0.4, delay: 0.65, ease: "easeOut" },
                  scale: { duration: 0.3, delay: 1.05, ease: "easeInOut" },
                }}
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </div>

          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-400">
            Order Confirmed
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-neutral-900">
            Thank you
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Order No. <span className="text-neutral-800">{ORDER.number}</span>
          </p>
        </div>

        {/* scene toggle */}
        <div className="mt-8 flex justify-center">{toggle}</div>

        {/* animation stage */}
        <div className="mt-6 border-y border-neutral-200">
          <Scene key={variant + "-" + runId} onArrived={() => setArrived(true)} />
        </div>

        {/* status line */}
        <div className="px-10 pt-8 text-center">
          <div className="flex min-h-[1.5rem] items-center justify-center">
            <AnimatePresence mode="wait">
              {arrived ? (
                <motion.p
                  key="gone"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-800"
                >
                  On its way
                </motion.p>
              ) : (
                <motion.p
                  key="prep"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-400"
                >
                  Preparing your parcel
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Estimated delivery <span className="text-neutral-800">{ORDER.eta}</span>
          </p>
        </div>

        {/* order summary */}
        <div className="px-10 py-8">
          <ul className="divide-y divide-neutral-100">
            {ORDER.items.map((item) => (
              <li key={item.name} className="flex items-baseline justify-between py-3 text-sm">
                <span className="text-neutral-700">
                  {item.name}
                  <span className="ml-2 text-neutral-400">×{item.qty}</span>
                </span>
                <span className="tabular-nums text-neutral-900">{fmt(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <Row label="Subtotal" value={fmt(subtotal)} />
            <Row label="Shipping" value={fmt(ORDER.shipping)} />
            <div className="flex items-baseline justify-between pt-2 text-neutral-900">
              <span className="text-[11px] font-medium uppercase tracking-[0.3em]">Total</span>
              <span className="tabular-nums text-base">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-px border-t border-neutral-200 bg-neutral-200">
          <button
            onClick={replay}
            className="flex-1 bg-white py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-600 transition hover:bg-neutral-50"
          >
            Replay
          </button>
          <button className="flex-1 bg-neutral-900 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800">
            Track Order
          </button>
        </div>
      </motion.main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between text-neutral-500">
      <span>{label}</span>
      <span className="tabular-nums text-neutral-700">{value}</span>
    </div>
  );
}
