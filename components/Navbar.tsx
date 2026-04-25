"use client";

import { useState, useRef, useEffect } from "react";

const CALCULATORS = [
  { label: "EMI Calculator", desc: "Loan repayment estimator" },
  { label: "SIP Calculator", desc: "Systematic investment planner" },
  { label: "Compound Interest", desc: "Growth over time" },
  { label: "Budget Planner", desc: "Monthly spend tracker" },
  { label: "Net Worth", desc: "Assets vs liabilities" },
];

export default function Navbar() {
  const [calcOpen, setCalcOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCalcOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex items-center justify-between h-[62px]">

            {/* ── Left: Logo ── */}
            <a href="/" className="flex items-center gap-2 select-none">
              {/* Green circle icon */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  flexShrink: 0,
                }}
              >
                {/* Leaf / plant icon */}
                <svg viewBox="0 0 20 20" fill="white" width={14} height={14}>
                  <path d="M10 2C7 2 4.5 4.5 4.5 7.5c0 1.8.8 3.4 2 4.5L10 7l3.5 5c1.2-1.1 2-2.7 2-4.5C15.5 4.5 13 2 10 2z" />
                  <rect x="9.25" y="11.5" width="1.5" height="5" rx="0.75" />
                </svg>
              </span>
              <span className="kedil-logo">Kedil</span>
            </a>

            {/* ── Center: Nav Links (desktop) ── */}
            <nav className="hidden md:flex items-center gap-8">

              {/* Calculators dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCalcOpen((v) => !v)}
                  className="nav-link flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
                  aria-expanded={calcOpen}
                  aria-haspopup="true"
                >
                  Calculators
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${calcOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {calcOpen && (
                  <div className="dropdown-enter absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden">
                    {/* Arrow */}
                    <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-gray-100 rotate-45" />

                    <div className="py-2">
                      {CALCULATORS.map((item) => (
                        <button
                          key={item.label}
                          className="w-full text-left px-4 py-2.5 flex flex-col gap-0.5 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
                        >
                          <span className="text-[0.875rem] font-medium text-gray-800">{item.label}</span>
                          <span className="text-[0.75rem] text-gray-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Blog */}
              <a
                href="https://www.kedil.money/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Blog
              </a>
            </nav>

            {/* ── Right: CTA (desktop) ── */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://app.kedil.money/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Login
              </a>
              <a
                href="https://app.kedil.money/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full bg-[#22c55e] text-white text-[0.875rem] font-medium tracking-wide hover:bg-[#16a34a] transition-colors duration-200 shadow-sm"
              >
                Sign up
              </a>
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden burger flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer ${mobileOpen ? "open" : ""}`}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="mobile-slide md:hidden border-t border-gray-100 bg-white px-5 pb-6 pt-4 flex flex-col gap-1">
            {/* Calculators label (non-interactive in mobile for simplicity) */}
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-gray-400 mt-2 mb-1 px-1">
              Calculators
            </p>
            {CALCULATORS.map((item) => (
              <button
                key={item.label}
                className="text-left px-1 py-2 text-[0.9rem] text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="my-2 h-px bg-gray-100" />

            <a
              href="https://www.kedil.money/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 py-2 text-[0.9rem] text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Blog
            </a>

            <div className="my-2 h-px bg-gray-100" />

            <a
              href="https://app.kedil.money/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 py-2 text-[0.9rem] text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Login
            </a>
            <a
              href="https://app.kedil.money/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full text-center px-5 py-2.5 rounded-full bg-[#22c55e] text-white text-[0.9rem] font-medium hover:bg-[#16a34a] transition-colors"
            >
              Sign up
            </a>
          </div>
        )}
      </header>
    </>
  );
}
