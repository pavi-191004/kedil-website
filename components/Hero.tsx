import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] text-center">
      {/* Dot-grid background ─ matches original */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Radial vignette so dots fade out toward centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, #f8f9fa 30%, transparent 100%)",
        }}
      />

      <div className="relative z-10 container-main py-24 md:py-36">
        {/* ── BETA banner ── */}
        <div
          className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm mb-8"
          style={{ animation: "fadeUp 0.5s ease both" }}
        >
          <span className="bg-[#22c55e] text-white text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase">
            BETA
          </span>
          <span className="text-sm text-gray-600 font-medium">
            Early access is live. Help us improve with your feedback!
          </span>
        </div>

        {/* ── Small description (above the big heading) ── */}
        <p
          className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-5 leading-relaxed"
          style={{ animation: "fadeUp 0.55s 0.08s ease both" }}
        >
          Kedil gives you a clear picture of your money, helps you stay
          disciplined by tracking progress, and guides you toward financial
          freedom with confidence.
        </p>

        {/* ── Big h1 with green keyword highlights ── */}
        <h1
          className="font-bold text-[#0f0f0f] text-4xl md:text-6xl lg:text-[4.25rem] leading-[1.08] max-w-3xl mx-auto mb-12"
          style={{ animation: "fadeUp 0.55s 0.16s ease both" }}
        >
          Built to Help You{" "}
          <span className="text-[#22c55e]">Reach</span> Financial Freedom
          &nbsp;&#8209;&nbsp;Without{" "}
          <span className="text-[#22c55e]">Stress</span>
        </h1>

        {/* ── CTA ── */}
        <div style={{ animation: "fadeUp 0.55s 0.24s ease both" }}>
          <Link
            href="https://app.kedil.money/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#22c55e] text-white text-base font-semibold hover:bg-[#16a34a] transition-colors duration-200"
          >
            Get Early Access
          </Link>
        </div>

        {/* ── Hero image ── */}
        <div
          className="mt-16 md:mt-20 rounded-2xl overflow-hidden shadow-2xl shadow-black/15 border border-gray-200"
          style={{ animation: "fadeUp 0.7s 0.32s ease both" }}
        >
          <Image
            src="https://framerusercontent.com/images/2NqdBhuwrVRRChEqVJ1aHZhmIYQ.jpg"
            alt="Kedil app — financial dashboard overview"
            width={1200}
            height={720}
            unoptimized
            priority
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
}
