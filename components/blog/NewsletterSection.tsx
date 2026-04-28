"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="border-t border-b border-gray-200">
      <div className="container-main py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left */}
          <div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug" style={{ letterSpacing: "-0.02em" }}>
              One habit.{" "}
              <span className="text-[#22c55e]">Every Tuesday.</span>{" "}
              Free.
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              Join 12,000+ Indian professionals who actually enjoy reading about money.
            </p>
          </div>

          {/* Right — form */}
          {submitted ? (
            <p className="text-sm font-semibold text-[#22c55e] shrink-0">
              ✓ You&apos;re subscribed!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 w-full sm:w-auto shrink-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e] transition"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2.5 rounded-full bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
