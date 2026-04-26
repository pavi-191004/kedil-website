import Link from "next/link";

export default function CTA() {
  return (
    <section
      className="relative py-28 md:py-40 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://framerusercontent.com/images/S4ReQGZorI21txUQqVXPfFTZ6vU.jpg)",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0f0f0f]/70" />

      {/* Content */}
      <div className="relative z-10 container-main text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-5" data-animate>
          Get started
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight" data-animate data-delay="1">
          Start Your Financial Clarity Today!
        </h2>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed" data-animate data-delay="2">
          We&rsquo;re inviting a small group to shape Kedil as it grows. Join
          Kedil and take control of your money &mdash; simply and confidently.
        </p>
        <div data-animate data-delay="3">
          <Link
            href="https://app.kedil.money/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#0f0f0f] text-base font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </section>
  );
}
