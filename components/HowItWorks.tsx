import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Plan with intention",
    description:
      "Create simple budgets that help you stay disciplined without feeling restricted.",
    img: "https://framerusercontent.com/images/IgHIL9exgtlPwbVByxGNs9ivciY.png",
  },
  {
    number: "02",
    title: "Track real progress",
    description:
      "See how your daily spending aligns with your plans and goals.",
    img: "https://framerusercontent.com/images/JPpIdDbkKoeBh6Qn5sSaq97ea5k.png",
  },
  {
    number: "03",
    title: "Get focused insights",
    description:
      "Understand where money gets stuck and what changes make the biggest difference.",
    img: "https://framerusercontent.com/images/pUiOY9JkxxQzXmGGYxMZCNsIE4.png",
  },
  {
    number: "04",
    title: "Move with confidence",
    description:
      "Make smarter decisions that help you reduce pressure and move faster toward freedom.",
    img: "https://framerusercontent.com/images/YzpgnmCyvu8HvM57xJ0x3u8qpt8.png",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <p className="section-eyebrow mb-4" data-animate>How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f0f0f] mb-5" data-animate data-delay="1">
            So, How Kedil Works?
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed" data-animate data-delay="2">
            Each step builds on the last &mdash; so clarity compounds instead
            of resetting every month.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-20 md:gap-28">
          {steps.map((step, i) => (
            <div
              key={step.number}
              data-animate
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text side */}
              <div className="flex-1 flex flex-col gap-4">
                <span className="section-eyebrow">{step.number}</span>
                <h3 className="text-2xl md:text-4xl font-bold text-[#0f0f0f]">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-500 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Image side */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <Image
                    src={step.img}
                    alt={step.title}
                    width={600}
                    height={440}
                    unoptimized
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
