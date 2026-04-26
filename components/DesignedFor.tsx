import Image from "next/image";

const cards = [
  {
    title: "Working professionals",
    description:
      "For people managing salaries, expenses, and commitments who want a clear monthly picture without constant tracking.",
    img: "https://framerusercontent.com/images/k1x8W527h0X0cMTVlzgYiqNxA.jpg",
  },
  {
    title: "Families planning ahead",
    description:
      "For households balancing daily expenses, savings, and long-term goals.",
    img: "https://framerusercontent.com/images/W5X36JVnmtNqwDM8GP6LNiWYu2E.jpg",
  },
  {
    title: "People focused on reducing debt",
    description:
      "For those paying off loans or cards who want structure, visibility, and steady progress.",
    img: "https://framerusercontent.com/images/CnGlM0iIWVJacvHZQCCIh4oEOg.jpg",
  },
  {
    title: "Anyone seeking financial clarity",
    description:
      "For people tired of complex tools and jargon who just want to understand where they stand.",
    img: "https://framerusercontent.com/images/bliUkxSIjRA5Ga65lOBXhcF5o.jpg",
  },
];

export default function DesignedFor() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f5f3]">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <p className="section-eyebrow mb-4" data-animate>Designed for</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-5" data-animate data-delay="1">
            Designed for the <span className="text-[#22c55e]">People</span> who seeks for clarity
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed" data-animate data-delay="2">
            Kedil is built for people who already manage money and want a
            calmer, more reliable way to stay on track.
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, i: number) => (
            <div
              key={card.title}
              data-animate
              data-delay={String((i % 2) + 1)}
              className="group rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-50">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="p-7">
                <h3 className="text-lg font-semibold text-[#0f0f0f] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
