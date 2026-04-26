import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f5f3]">
      <div className="container-main">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0f0f0f] mb-4 tracking-tight"
            data-animate
          >
            So, How <span className="text-[#22c55e]">Kedil</span> Works?
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed" data-animate data-delay="1">
            Each step builds on the last &mdash; so clarity compounds instead of resetting every month.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

          {/* Card 1: Budget Trend image */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            data-animate
          >
            <Image
              src="https://framerusercontent.com/images/IgHIL9exgtlPwbVByxGNs9ivciY.png"
              alt="Budget Trend chart"
              width={680}
              height={500}
              unoptimized
              className="w-full h-auto block"
            />
          </div>

          {/* Card 2: Track real progress + Spending vs Budget image */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden"
            data-animate
            data-delay="1"
          >
            <div className="p-8 pb-5">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f0f0f] mb-2">
                Track real progress
              </h3>
              <p className="text-gray-500 leading-relaxed">
                See how your daily spending aligns with your plans and goals.
              </p>
            </div>
            <div className="mt-auto">
              <Image
                src="https://framerusercontent.com/images/JPpIdDbkKoeBh6Qn5sSaq97ea5k.png"
                alt="Spending vs Budget chart"
                width={680}
                height={360}
                unoptimized
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Card 3: Plan with intention text */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center"
            data-animate
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f0f0f] mb-3">
              Plan with intention
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Create simple budgets that help you stay disciplined without feeling restricted.
            </p>
          </div>

          {/* Card 4: Get focused insights + Interest Heatmap */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden"
            data-animate
            data-delay="1"
          >
            <div className="p-8 pb-5">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0f0f0f] mb-2">
                Get focused insights
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Understand where money gets stuck and what changes make the biggest difference.
              </p>
            </div>
            <div className="mt-auto px-6 pb-6">
              <Image
                src="https://framerusercontent.com/images/pUiOY9JkxxQzXmGGYxMZCNsIE4.png"
                alt="Interest Heatmap"
                width={680}
                height={300}
                unoptimized
                className="w-full h-auto block rounded-xl"
              />
            </div>
          </div>

          {/* Card 5: Term insurance / financial pillar card */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            data-animate
          >
            <Image
              src="https://framerusercontent.com/images/YzpgnmCyvu8HvM57xJ0x3u8qpt8.png"
              alt="Term insurance financial pillar"
              width={680}
              height={400}
              unoptimized
              className="w-full h-auto block"
            />
          </div>

          {/* Card 6: Move with confidence */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center"
            data-animate
            data-delay="1"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f0f0f] mb-3">
              Move with confidence
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Make smarter decisions that help you reduce pressure and move faster toward freedom.
            </p>
          </div>

        </div>

        {/* Footer text */}
      

      </div>
    </section>
  );
}
