"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is Kedil a bank or a lending app?",
    answer:
      "No. Kedil is a personal finance management tool that helps you track spending, plan budgets, and understand your financial health. We don't hold funds, offer credit, or lend money.",
  },
  {
    question: "Do I need to connect my bank account directly?",
    answer:
      "Not at the moment. You can manually log your transactions or import data. We're working on secure bank integrations that will make this even easier in the future.",
  },
  {
    question: "Is my financial data safe with Kedil?",
    answer:
      "Absolutely. We use bank-grade encryption and security practices aligned with SOC 2 and ISO 27001 standards. Your data is hosted on Azure infrastructure and is never sold, shared, or used for advertising.",
  },
  {
    question: "What's available now, and what's coming later?",
    answer:
      "Currently available: budgeting, expense tracking, debt management, multi-account overview, and financial learning content. Coming soon: automated bank syncing, advanced analytics, and goal tracking.",
  },
  {
    question: "Is Kedil free? Do I need to pay?",
    answer:
      "Kedil is free during the beta period. As we grow we'll introduce paid plans, but early users who join now will be recognized and rewarded for their support.",
  },
  {
    question: "Who is Kedil built for?",
    answer:
      "Kedil is built for working professionals, families, and anyone who wants to understand their finances clearly — without complex spreadsheets or overwhelming financial jargon.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 md:mb-20">
          <p className="section-eyebrow mb-4">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-5">
            Still have Questions?
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Clear answers to common questions, simplifying your experience
            instantly.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto divide-y divide-gray-100 border-t border-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer bg-transparent border-none"
              >
                <span className="text-base font-medium text-[#0f0f0f]">
                  {faq.question}
                </span>
                <ChevronIcon open={openIndex === i} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i
                    ? "max-h-64 opacity-100 pb-5"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
