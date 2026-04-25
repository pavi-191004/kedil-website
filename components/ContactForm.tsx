"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 800);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition";

  return (
    <section className="bg-[#f5f5f3] px-4 md:px-8 pt-6 pb-3">
      <div className="rounded-[24px] bg-[#1a1a1a] py-16 md:py-20 px-8 md:px-16">
        {submitted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Message received!</h2>
            <p className="text-gray-400">
              Thanks, {form.name}. We&rsquo;ll get back to you at {form.email}.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
              className="mt-6 text-sm text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start max-w-[1100px] mx-auto">

            {/* Left: heading + subtitle */}
            <div className="md:flex-1">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                Get in{" "}
                <span className="text-[#22c55e]">touch</span>{" "}
                with us!
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                Still need help, or want to discover more about Kedil?<br className="hidden md:block" />
                We&rsquo;re here to support you every step of the way.
              </p>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleSubmit}
              className="md:flex-1 w-full flex flex-col gap-4"
            >
              {/* Name + Email row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                  className={inputCls}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@framer.com"
                  required
                  className={inputCls}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-400">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message here"
                  rows={5}
                  required
                  className={`${inputCls} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#22c55e] text-white font-semibold text-sm hover:bg-[#16a34a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Submit"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
