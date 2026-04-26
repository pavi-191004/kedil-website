import Image from "next/image";

const testimonials = [
  {
    name: "Jonathan Day",
    role: "Early user",
    quote:
      "Seeing everything in one place helped me stop second-guessing my decisions.",
    img: "https://framerusercontent.com/images/RnlZlUp5GcLVlfS43Q4nd6kA9c.jpg",
  },
  {
    name: "Terri Williams",
    role: "Early access user",
    quote:
      "Once things were clear, staying disciplined didn't feel forced anymore.",
    img: "https://framerusercontent.com/images/oUkBi1c8nERocfQrJWNLxZ9Fipw.jpg",
  },
  {
    name: "Melissa Reid",
    role: "Beta tester",
    quote:
      "Just realized how much mental load came from not knowing where I stood financially.",
    img: "https://framerusercontent.com/images/5P0eN6qtSxQg8Lrk6rw2GR9e7eI.jpg",
  },
  {
    name: "Belinda Meyers",
    role: "Beta user",
    quote:
      "I check my finances less often now — and feel more confident about them.",
    img: "https://framerusercontent.com/images/kIBiy2xM79Ac692vRBBeMc3YFw8.jpg",
  },
  {
    name: "Chris Wright",
    role: "Working professional",
    quote:
      "It feels less like tracking money and more like finally understanding it.",
    img: "https://framerusercontent.com/images/G1bC6MQnKLl8c7ZyjwpJlVGuw.jpg",
  },
  {
    name: "Sarah Yanna",
    role: "Early user",
    quote:
      "Nothing fancy. Just clarity. And that's exactly what I needed.",
    img: "https://framerusercontent.com/images/X69CSaL5GOIA9ZgjxkdlXWjG7w.jpg",
  },
];

/* Split into 3 columns of 2, each doubled for seamless loop */
const col1 = [testimonials[0], testimonials[1], testimonials[0], testimonials[1]];
const col2 = [testimonials[2], testimonials[3], testimonials[2], testimonials[3]];
const col3 = [testimonials[4], testimonials[5], testimonials[4], testimonials[5]];

function TestimonialCard({
  t,
}: {
  t: { name: string; role: string; quote: string; img: string };
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 mb-4">
      {/* Quote at top */}
      <p className="text-sm text-gray-700 leading-relaxed flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author at bottom */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={t.img}
            alt={t.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0f0f0f] leading-tight">{t.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function Column({
  cards,
  duration,
  delay = "0s",
}: {
  cards: typeof col1;
  duration: string;
  delay?: string;
}) {
  return (
    /* Each column clips overflow and runs the upward scroll */
    <div className="flex-1 overflow-hidden" style={{ maxHeight: "600px" }}>
      <div
        className="testimonial-col"
        style={{ animationDuration: duration, animationDelay: delay }}
      >
        {cards.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f5f3]">
      {/* Header */}
      <div className="container-main text-center mb-14 md:mb-20">
        <p className="section-eyebrow mb-4" data-animate>Testimonials</p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-5" data-animate data-delay="1">
          Clarity <span className="text-[#22c55e]">Changes</span> How People Feel About Money
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed" data-animate data-delay="2">
          What early users noticed once everything was visible in one place.
        </p>
      </div>

      {/* 3-column vertical scroll grid */}
      <div className="container-main">
        <div className="flex gap-4 md:gap-6">
          {/* Column 1 — normal speed */}
          <Column cards={col1} duration="22s" />

          {/* Column 2 — faster, offset start so it looks staggered */}
          <Column cards={col2} duration="17s" delay="-6s" />

          {/* Column 3 — slowest */}
          <Column cards={col3} duration="26s" delay="-12s" />
        </div>
      </div>
    </section>
  );
}
