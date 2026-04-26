"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 1.1", "start 0.25"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);

  return (
    <section className="relative overflow-hidden bg-[#f5f5f3] text-center">
      {/* Dot-grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Radial vignette so dots fade toward centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 45%, #f5f5f3 30%, transparent 100%)",
        }}
      />

      <div className="relative z-10 container-main py-24 md:py-36">

        {/* BETA banner */}
        <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm mb-8" data-animate>
          <span className="bg-[#22c55e] text-white text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase">
            BETA
          </span>
          <span className="text-sm text-gray-600 font-medium">
            Early access is live. Help us improve with your feedback!
          </span>
        </div>

        {/* Small description */}
        <p
          className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-5 leading-relaxed"
          data-animate
          data-delay="1"
        >
          Kedil gives you a clear picture of your money, helps you stay
          disciplined by tracking progress, and guides you toward financial
          freedom with confidence.
        </p>

        {/* Main heading */}
        <h1
          className="font-bold text-[#0f0f0f] text-4xl md:text-6xl lg:text-[4.25rem] leading-[1.08] max-w-3xl mx-auto mb-12"
          data-animate
          data-delay="2"
        >
          Built to Help You{" "}
          <span className="text-[#22c55e]">Reach</span> Financial Freedom
          &nbsp;&#8209;&nbsp;Without{" "}
          <span className="text-[#22c55e]">Stress</span>
        </h1>

        {/* CTA */}
        <div data-animate data-delay="3">
          <Link
            href="https://app.kedil.money/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#22c55e] text-white text-base font-semibold hover:bg-[#16a34a] transition-colors duration-200"
          >
            Get Early Access
          </Link>
        </div>

        {/* App screenshot with scroll-driven rotateX reveal */}
        <div
          ref={imageRef}
          className="mt-16 md:mt-20"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              opacity,
              transformOrigin: "bottom center",
            }}
            className="rounded-2xl overflow-hidden shadow-2xl shadow-black/15 border border-gray-200"
          >
            <Image
              src="/dashboard.png"
              alt="Kedil app — financial dashboard overview"
              width={1456}
              height={816}
              unoptimized
              priority
              className="w-full h-auto block"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
