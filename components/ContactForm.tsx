"use client";

import { useState, FormEvent } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    /* No backend — simulate async */
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0f0f0f] placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition";

  return (
    <section className="bg-[#f9f9f9] py-24 md:py-32">
      <div className="container-main">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="section-eyebrow mb-4">Contact</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-4">
              Get in touch with us!
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Still need help, or want to discover more about Kedil? We&rsquo;re
              here to support you every step of the way.
            </p>
          </div>

          {submitted ? (
            /* Success state */
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-7 h-7 text-emerald-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0f]">
                Message received!
              </h3>
              <p className="text-sm text-gray-500">
                Thanks for reaching out, {form.name}. We&rsquo;ll get back to
                you shortly at {form.email}.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-2 text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 flex flex-col gap-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows={5}
                  required
                  className={`${inputBase} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
