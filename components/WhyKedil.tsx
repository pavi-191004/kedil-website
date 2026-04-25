import Link from "next/link";

const CARDS = [
  {
    text: "Kedil transforms financial confusion into practical, everyday clarity.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    text: "It goes beyond numbers to show how money shapes your habits and future.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    text: "Because clarity isn't comfort alone, it's momentum and measurable progress.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
  },
];

export default function WhyKedil() {
  return (
    <section className="bg-[#0a0a0a] py-24 md:py-32">
      <div className="container-main flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-xl" data-animate>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Why Kedil was built?
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Not another finance app &mdash; a system designed to remove friction
            and help capable people move forward with confidence.
          </p>
        </div>

        {/* Cards */}
        <div className="w-full max-w-[420px] flex flex-col gap-4">
          {CARDS.map((card, i) => (
            <div
              key={i}
              data-animate
              data-delay={String(i + 1)}
              className="relative flex flex-col p-8 rounded-[28px]"
              style={{
                background: "linear-gradient(145deg, #232323 0%, #1a1a1a 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* Top inner glow strip */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-[28px]"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
              />

              {/* Icon badge */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {card.icon}
              </div>

              {/* Body text */}
              <p className="text-white/90 text-lg md:text-xl font-medium leading-snug">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div data-animate data-delay="4">
          <Link
            href="https://app.kedil.money/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#22c55e] text-white text-[0.9rem] font-semibold hover:bg-[#16a34a] transition-colors duration-200"
          >
            Get Early Access
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
