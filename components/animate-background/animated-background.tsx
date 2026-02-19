"use client";

import { useEffect, useRef } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function AnimatedBackground() {
  const b1 = useRef<HTMLDivElement | null>(null);
  const b2 = useRef<HTMLDivElement | null>(null);
  const b3 = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60; // stronger
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      mouse.current = { x: clamp(x, -60, 60), y: clamp(y, -60, 60) };
    };

    window.addEventListener("mousemove", onMove);

    const loop = (t: number) => {
      const time = t * 0.001;

      // auto drift (always moving)
      const drift1 = {
        x: Math.sin(time * 0.7) * 35,
        y: Math.cos(time * 0.6) * 28,
      };
      const drift2 = {
        x: Math.cos(time * 0.55) * 40,
        y: Math.sin(time * 0.75) * 30,
      };
      const drift3 = {
        x: Math.sin(time * 0.45) * 30,
        y: Math.cos(time * 0.5) * 38,
      };

      const m = mouse.current;

      if (b1.current) {
        b1.current.style.transform = `translate3d(${drift1.x + m.x}px, ${drift1.y + m.y}px, 0)`;
      }
      if (b2.current) {
        b2.current.style.transform = `translate3d(${drift2.x - m.x}px, ${drift2.y + m.y}px, 0)`;
      }
      if (b3.current) {
        b3.current.style.transform = `translate3d(${drift3.x + m.x}px, ${drift3.y - m.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* subtle grid texture */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_1px_1px,rgba(37,99,235,0.10)_1px,transparent_0)] [background-size:26px_26px]" />

      {/* blob 1 */}
      <div className="absolute -top-52 -left-52">
        <div
          ref={b1}
          className="h-[680px] w-[680px] rounded-full blur-2xl opacity-80 mix-blend-multiply will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,1), transparent 62%)",
          }}
        />
      </div>

      {/* blob 2 */}
      <div className="absolute -top-44 -right-60">
        <div
          ref={b1}
          className="h-[680px] w-[680px] rounded-full blur-2xl opacity-80 mix-blend-multiply will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,1), transparent 62%)",
          }}
        />
      </div>

      {/* blob 3 */}
      <div className="absolute -bottom-80 left-1/3">
        <div
          ref={b1}
          className="h-[680px] w-[680px] rounded-full blur-2xl opacity-80 mix-blend-multiply will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,1), transparent 62%)",
          }}
        />
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/55" />
    </div>
  );
}
