const bullets = [
  "Secure, bank-grade infrastructure hosted on AZURE",
  "End-to-end encryption for sensitive information",
  "SOC 2 & ISO 27001 aligned security practices",
  "Your data is never sold, shared, or misused",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 shrink-0 text-emerald-400"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Security() {
  return (
    <section className="bg-[#0f0f0f] py-24 md:py-32">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 mb-5" data-animate>
            Security & Privacy
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight" data-animate data-delay="1">
            Managing your Money shouldn&rsquo;t feel complicated!
          </h2>

          {/* Sub */}
          <p className="text-lg text-gray-400 leading-relaxed mb-12 md:mb-16" data-animate data-delay="2">
            Your financial information is personal. Kedil is built to protect
            it and to use it responsibly.
          </p>

          {/* Bullets */}
          <ul className="flex flex-col gap-5 text-left max-w-xl mx-auto">
            {bullets.map((bullet, i) => (
              <li key={bullet} data-animate data-delay={String(i + 1)} className="flex items-start gap-4">
                <CheckIcon />
                <span className="text-base text-gray-200 leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
