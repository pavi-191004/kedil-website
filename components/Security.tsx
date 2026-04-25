const bullets = [
  {
    text: "Secure, bank-grade infrastructure hosted on AZURE",
    color: "#22c55e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    text: "End-to-end encryption for sensitive information",
    color: "#f97316",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    text: "SOC 2 & ISO 27001 aligned security practices",
    color: "#22c55e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    text: "Your data is never sold, shared, or misused",
    color: "#22c55e",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 10a2 2 0 0 0-2 2c0 1.02.5 1.91 1.26 2.46C10.55 15.37 10 16.62 10 18h4c0-1.38-.55-2.63-1.26-3.54A2 2 0 0 0 12 10z" />
        <path d="M12 2C9.243 2 7 4.243 7 7v2h10V7c0-2.757-2.243-5-5-5z" />
        <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      </svg>
    ),
  },
];

export default function Security() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-5 leading-tight" data-animate>
            Managing your <span className="text-[#22c55e]">Money</span>
            <br />shouldn&rsquo;t feel complicated!
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed" data-animate data-delay="1">
            Your financial information is personal. Kedil is built to protect
            it and to use it responsibly.
          </p>
        </div>

        {/* 4-column white card */}
        <div
          className="bg-white rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100"
          data-animate
          data-delay="2"
        >
          {bullets.map((b) => (
            <div key={b.text} className="flex items-start gap-4 p-7">
              <span style={{ color: b.color }} className="shrink-0 mt-0.5">
                {b.icon}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
