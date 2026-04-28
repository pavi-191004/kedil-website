"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CALCULATORS = [
  { label: "Prepay vs Invest Calculator", href: "/calculators/prepay-vs-invest" },
  { label: "Rent vs Buy Calculator", href: "/calculators/rent-vs-buy/" },
];

export default function Navbar() {
  const [calcOpen, setCalcOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCalcOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="sticky top-0 z-50 px-4 md:px-8 pt-4 pb-0 bg-[#f5f5f3]"
    >
      {/* Pill container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="px-5 md:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 select-none">
              <Image
                src="/app_logo.png"
                alt="Kedil"
                width={32}
                height={32}
                className="shrink-0"
              />
              <span className="kedil-logo">Kedil</span>
            </a>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-8">
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
                    <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-gray-100 rotate-45" />
                    <div className="py-2">
                      {CALCULATORS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setCalcOpen(false)}
                          className="w-full text-left px-4 py-2.5 flex flex-col gap-0.5 hover:bg-gray-50 transition-colors duration-100 cursor-pointer"
                        >
                          <span className="text-[0.875rem] font-medium text-gray-800">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/blog" className="nav-link">
                Blog
              </Link>
            </nav>

            {/* Desktop CTA */}
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

            {/* Hamburger */}
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
      </div>

      {/* Mobile menu — separate pill below */}
      {mobileOpen && (
        <div className="mobile-slide mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] px-5 pb-6 pt-4 flex flex-col gap-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-gray-400 mt-2 mb-1 px-1">
            Calculators
          </p>
          {CALCULATORS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-left px-1 py-2 text-[0.9rem] text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="my-2 h-px bg-gray-100" />

          <Link
            href="/blog"
            className="px-1 py-2 text-[0.9rem] text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            Blog
          </Link>

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
  );
}
