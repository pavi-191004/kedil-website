export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div className="max-w-sm">
            <p className="font-serif text-xl font-semibold text-[#0f0f0f] mb-2">
              Kedil
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kedil helps you see your entire financial life clearly &mdash; so
              you can make confident decisions without overthinking or
              spreadsheets.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <a
              href="https://www.kedil.money/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0f0f0f] transition-colors"
            >
              Blog
            </a>
            <a
              href="https://app.kedil.money/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0f0f0f] transition-colors"
            >
              Login
            </a>
            <a
              href="https://app.kedil.money/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0f0f0f] transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>&copy; 2026 Kedil Money. All rights reserved.</p>
          <p>Built for financial clarity.</p>
        </div>
      </div>
    </footer>
  );
}
