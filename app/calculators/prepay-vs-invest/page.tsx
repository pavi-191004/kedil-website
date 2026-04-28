import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PrepayVsInvestClient from "./PrepayVsInvestClient";

export const metadata: Metadata = {
  title: "Home Loan Prepayment Calculator — Save Lakhs on Interest | Kedil",
  description:
    "Find out how much interest you save by prepaying your home loan vs investing the lump sum in mutual funds or FDs.",
  alternates: {
    canonical: "https://kedil.money/calculators/prepay-vs-invest",
  },
  openGraph: {
    title: "Home Loan Prepayment Calculator — Save Lakhs on Interest | Kedil",
    description:
      "Find out how much interest you save by prepaying your home loan vs investing the lump sum in mutual funds or FDs.",
    url: "https://kedil.money/calculators/prepay-vs-invest",
    siteName: "Kedil",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Loan Prepayment Calculator — Save Lakhs on Interest | Kedil",
    description:
      "Find out how much interest you save by prepaying your home loan vs investing the lump sum in mutual funds or FDs.",
  },
  keywords: [
    "prepay vs invest calculator",
    "should I prepay home loan or invest in mutual funds",
    "home loan prepayment vs SIP calculator",
    "is it better to prepay home loan or invest in FD",
    "home loan part payment calculator with tax benefit",
    "prepay home loan or invest in Nifty 50 index fund",
  ],
};

const DEFAULT_INPUTS = {
  loan: 3000000,
  rate: 8.5,
  tenureYears: 15,
  surplus: 500000,
  taxSlab: 30,
  mfReturn: 12,
  prepaymentCharges: 0,
  regime: "old",
  freedEmiReinvest: false,
} as const;

const fmt = (value: number) => {
  if (!isFinite(value)) return "₹0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const emi = (principal: number, rate: number, months: number) => {
  if (principal <= 0 || months <= 0) return 0;
  if (rate === 0) return principal / months;
  const monthlyRate = rate / 12 / 100;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

const amortize = (principal: number, rate: number, months: number, fixedEmi?: number) => {
  const monthlyEmi = fixedEmi || emi(principal, rate, months);
  const monthlyRate = rate / 12 / 100;
  let balance = principal;
  let totalInterest = 0;
  const yearly: { interest: number; principal: number }[] = [];
  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let month = 1; month <= months; month++) {
    if (balance <= 0) break;
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(monthlyEmi - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    yearInterest += interest;
    yearPrincipal += principalPaid;

    if (month % 12 === 0 || month === months || balance <= 0) {
      yearly.push({ interest: yearInterest, principal: yearPrincipal });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  let loanFreeMonth = months;
  let rollingBalance = principal;
  for (let month = 1; month <= months; month++) {
    if (rollingBalance <= 0) {
      loanFreeMonth = month - 1;
      break;
    }
    const interest = rollingBalance * monthlyRate;
    const principalPaid = Math.min(monthlyEmi - interest, rollingBalance);
    rollingBalance = Math.max(0, rollingBalance - principalPaid);
    if (rollingBalance <= 0) {
      loanFreeMonth = month;
      break;
    }
  }

  return { monthlyEmi, totalInterest, yearly, loanFreeMonth };
};

const buildDefaultSummary = () => {
  const months = DEFAULT_INPUTS.tenureYears * 12;
  const taxRate = DEFAULT_INPUTS.taxSlab / 100;
  const baseEmi = emi(DEFAULT_INPUTS.loan, DEFAULT_INPUTS.rate, months);
  const prepayPrincipal = Math.max(0, DEFAULT_INPUTS.loan - DEFAULT_INPUTS.surplus);
  const noPrepay = amortize(DEFAULT_INPUTS.loan, DEFAULT_INPUTS.rate, months, baseEmi);
  const prepaid = amortize(prepayPrincipal, DEFAULT_INPUTS.rate, months, baseEmi);
  const interestSaved = noPrepay.totalInterest - prepaid.totalInterest;
  const prepaymentCharge = DEFAULT_INPUTS.surplus * (DEFAULT_INPUTS.prepaymentCharges / 100);
  const section24Lost = DEFAULT_INPUTS.regime === "old"
    ? noPrepay.yearly.reduce((sum, current, index) => {
        const currentCap = Math.min(current.interest, 200000);
        const prepaidCap = Math.min(prepaid.yearly[index]?.interest || 0, 200000);
        return sum + (currentCap - prepaidCap) * taxRate;
      }, 0)
    : 0;
  const section80CLost = DEFAULT_INPUTS.regime === "old"
    ? noPrepay.yearly.reduce((sum, current, index) => {
        const currentCap = Math.min(current.principal, 150000);
        const prepaidCap = Math.min(prepaid.yearly[index]?.principal || 0, 150000);
        return sum + (currentCap - prepaidCap) * taxRate;
      }, 0)
    : 0;
  const prepayNet = interestSaved - prepaymentCharge - section24Lost - section80CLost;
  const mutualFundValue = DEFAULT_INPUTS.surplus * Math.pow(1 + DEFAULT_INPUTS.mfReturn / 100, DEFAULT_INPUTS.tenureYears);
  const mutualFundGains = mutualFundValue - DEFAULT_INPUTS.surplus;
  const mutualFundTax = Math.max(0, mutualFundGains - 125000) * 0.125;
  const mutualFundNet = mutualFundValue - mutualFundTax;
  const winner = mutualFundNet > prepayNet ? "invest" : "prepay";

  const years = Math.floor(prepaid.loanFreeMonth / 12);
  const monthsRemaining = prepaid.loanFreeMonth % 12;

  return {
    interestSaved,
    prepayNet,
    mutualFundNet,
    winner,
    loanFreeText: `${years > 0 ? `${years} yr ` : ""}${monthsRemaining > 0 ? `${monthsRemaining} mo` : ""}`.trim() || "0",
  };
};

const defaultSummary = buildDefaultSummary();

const sectionCard = {
  background: "#F7F7F5",
  border: "1px solid #E5E5E0",
  borderRadius: 16,
  padding: "22px",
  marginTop: 16,
  boxShadow: "0 10px 30px rgba(26, 26, 26, 0.04)",
} as const;

const plainSectionCard = {
  background: "transparent",
  border: "none",
  borderRadius: 0,
  padding: 0,
  marginTop: 16,
  boxShadow: "none",
} as const;

const faqItems = [
  {
    q: "Should I prepay my home loan or invest in SIP in India?",
    a: "Prepaying your home loan makes more financial sense when your interest rate is above 9% and you're in the first half of your tenure — the guaranteed interest saving beats a conservative FD or debt fund on a risk-adjusted basis. Investing in a SIP wins over the long run if your equity returns exceed your loan rate, which the Nifty 50 TRI has historically done at ~13% CAGR over 20+ years. The right answer depends on your specific loan rate, tenure remaining, and risk appetite — use this calculator to see your personal numbers before deciding.",
  },
  {
    q: "What is the best time to make a lump sum prepayment on a home loan?",
    a: "The best time to prepay is in the early years of your loan — ideally within the first 5–8 years. EMIs in this period are heavily weighted toward interest, so prepaying principal now eliminates years of compounding interest. Prepayment in the final 3–4 years of a loan has much lower impact because most of the interest has already been paid through your regular EMIs.",
  },
  {
    q: "Does prepaying a home loan affect Section 80C or Section 24 tax benefits?",
    a: "Prepayment reduces your outstanding principal, which reduces the interest component of your future EMIs — and a lower interest component means a smaller Section 24(b) deduction, currently capped at ₹2 lakh per year for self-occupied property. The principal repayment portion of your regular EMI remains eligible under Section 80C (up to ₹1.5 lakh), but a one-time lump sum prepayment made outside your regular EMI schedule is NOT eligible for Section 80C deduction.",
  },
  {
    q: "Is it better to reduce EMI or reduce tenure after prepayment?",
    a: "Choosing tenure reduction saves you significantly more interest than reducing your EMI — it eliminates months or years of future interest accrual entirely. Choosing EMI reduction keeps your tenure the same, which means you pay interest for just as long. Unless you have a cash flow constraint and need the lower monthly outgo, tenure reduction is almost always the mathematically better option for Indian borrowers.",
  },
  {
    q: "Do Indian banks charge a prepayment penalty on home loans?",
    a: "Floating rate home loans in India carry zero prepayment penalty — the RBI mandated this in 2012. If you're on a fixed-rate home loan, your lender may charge a foreclosure fee of 2–4% of the prepaid amount. Most borrowers in India are on floating rate loans linked to the repo rate (RLLR or MCLR), which means prepayment is completely free of charge.",
  },
  {
    q: "Is it better to prepay home loan or invest in FD in 2026?",
    a: "Prepaying your home loan is typically better than an FD for borrowers on a rate above 8%, because the guaranteed interest saving on the loan outpaces the post-tax FD return. FD interest is taxed at your income slab rate — for someone in the 30% bracket, a 7% FD yields just 4.9% after tax. Your home loan interest rate is almost certainly higher than that, making prepayment the mathematically superior option in most cases in 2026.",
  },
  {
    q: "How does the home loan part payment calculator handle LTCG tax on investments?",
    a: "Equity mutual fund returns held for more than 1 year are subject to Long Term Capital Gains (LTCG) tax at 12.5% on gains above ₹1.25 lakh per year, as updated in Union Budget 2024. The calculator applies this tax to the investment scenario so the comparison is on a post-tax basis — not a gross return basis that would flatter the investment option. FD returns are modelled at your applicable income tax slab rate.",
  },
  {
    q: "What does home loan prepayment vs SIP comparison actually mean?",
    a: "The comparison is based on the opportunity cost principle — if you use ₹X to prepay your home loan, you save a fixed, guaranteed amount of interest over your remaining tenure. If you invest the same ₹X in a monthly SIP, you earn a variable, market-dependent return. This calculator models both scenarios using your actual loan figures and your chosen return assumption, then shows the net rupee difference — so you make the decision with data, not gut feel.",
  },
] as const;

const sections: Array<{
  id: string;
  title: string;
  content: ReactNode;
  plain?: boolean;
  white?: boolean;
  emphasis?: boolean;
}> = [
  {
    id: "understanding-your-results",
    title: "Understanding your results",
    white: true,
    content: (
      <>
        <p style={{ margin: "0 0 10px", lineHeight: 1.7, color: "#1A1A1A" }}>
          Find out exactly how much interest you save — and how many years you cut — by making a lump-sum prepayment on your home loan vs. investing that money in mutual funds or FDs.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>
          Built for salaried professionals in India who want a clear, data-backed answer and not generic advice.
        </p>
      </>
    ),
  },
  {
    id: "how-to-use-this-calculator",
    title: "How to use the home loan prepayment calculator",
    plain: true,
    content: (
      <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", color: "#5C5C5C", lineHeight: 1.75, display: "grid", gap: 10 }}>
        {[
          "Enter your outstanding loan amount — this is the principal balance still remaining, not the original loan you took.",
          "Add your current interest rate — use the exact rate on your latest loan statement, not a rounded estimate.",
          "Enter your remaining tenure in months — if 18 years are left, enter 216.",
          "Enter the lump sum you're considering — this is the amount you're deciding whether to prepay or invest elsewhere.",
          "Choose an investment return assumption — conservative (7% FD), moderate (12% equity SIP), or aggressive (15% direct equity).",
          "See your personalised savings summary — interest saved, tenure cut, and how prepayment compares to a home loan prepayment vs SIP investment over 15 years.",
        ].map((step, index) => (
          <li key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: "50%",
                background: "#E6F5ED",
                color: "#157A49",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
                fontSize: 13,
              }}
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "factors-that-affect-this-calculation",
    title: "Factors that affect home loan prepayment savings",
    plain: true,
    emphasis: true,
    content: (
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A", fontWeight: 600 }}>How your home loan interest rate affects prepayment savings</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>The higher your interest rate, the more valuable every rupee of prepayment becomes. At 9% interest, prepaying ₹5 lakhs today can save you ₹8–12 lakhs over the remaining tenure — because the saved interest compounds over years, not just months. If your lender revised your rate upward after RBI's repo rate hikes in 2022–23, your prepayment benefit is likely higher than what you calculated at origination.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A", fontWeight: 600 }}>Why remaining loan tenure changes the math</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>Prepayment in the first 5–7 years of a home loan gives dramatically better returns than prepaying in year 15 or 18. In the early years, your EMIs are almost entirely interest — eliminating principal now stops years of compounding from accruing. If you're in the first half of your loan tenure, prepayment almost always beats a conservative FD or debt fund on a risk-adjusted, post-tax basis.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A", fontWeight: 600 }}>Opportunity cost: what your money could earn if you invest instead</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>The real question is not just "how much interest do I save" — it's "what else could this money do?" A ₹5 lakh lump sum in a Nifty 50 index fund has historically returned 12–14% CAGR over 15+ years, which can outpace the guaranteed interest saving on a home loan at 8.5–9%. This calculator models both sides so you see the actual rupee gap — not an estimate.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A", fontWeight: 600 }}>Tax benefit loss under Section 24 when you prepay</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>Home loan borrowers can claim up to ₹2 lakh per year in interest deduction under Section 24(b) for self-occupied property. When you prepay and reduce your principal, your interest component drops — and so does your Section 24 deduction. For someone in the 30% tax bracket, that's up to ₹60,000 per year in lost tax benefit. The calculator accounts for this when computing your net savings, so you see the real picture.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A", fontWeight: 600 }}>How inflation erodes the real value of fixed deposit returns</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>An FD at 7% sounds attractive — but India's average CPI inflation has been 5–6% over the last decade, making the real return on an FD roughly 1–2% post-inflation, post-tax. Compared to the guaranteed interest rate saving on your home loan — which is effectively a risk-free, tax-equivalent return — FDs often lose the comparison on a net basis. Equity investments, however, have historically beaten inflation by 6–8% annually over 15+ year horizons.</p>
        </div>
      </div>
    ),
  },
  {
    id: "frequently-asked-questions",
    title: "Frequently asked questions",
    plain: true,
    content: (
      <div style={{ display: "grid", gap: 10 }}>
        {faqItems.map((item) => (
          <details key={item.q} style={{ background: "#FFFFFF", border: "1px solid #E5E5E0", borderRadius: 12, padding: "0 14px" }}>
            <summary
              style={{
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                cursor: "pointer",
                padding: "14px 0",
                fontSize: 16,
                color: "#1A1A1A",
                fontWeight: 700,
              }}
            >
              <span>{item.q}</span>
              <span style={{ color: "#5C5C5C", fontSize: 18, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
                ▾
              </span>
            </summary>
            <p style={{ margin: "0 0 14px", lineHeight: 1.7, color: "#5C5C5C" }}>{item.a}</p>
          </details>
        ))}
      </div>
    ),
  },
  {
    id: "related-tools",
    title: "Other Kedil calculators you might find useful",
    plain: true,
    content: (
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <Link href="/calculators/rent-vs-buy" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E0", borderRadius: 14, padding: 18, height: "100%" }}>
            <div style={{ fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>Rent vs Buy Calculator India</div>
            <div style={{ color: "#5C5C5C", lineHeight: 1.65 }}>Find out if buying a home makes financial sense right now.</div>
          </div>
        </Link>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E0", borderRadius: 14, padding: 18, height: "100%" }}>
          <div style={{ fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>SIP Returns Calculator</div>
          <div style={{ color: "#5C5C5C", lineHeight: 1.65 }}>See how your monthly SIP could grow over 10 20 years.</div>
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E0", borderRadius: 14, padding: 18, height: "100%" }}>
          <div style={{ fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>EMI Calculator India</div>
          <div style={{ color: "#5C5C5C", lineHeight: 1.65 }}>Calculate your monthly EMI for any loan amount and rate.</div>
        </div>
      </div>
    ),
  },
  {
    id: "methodology-and-assumptions",
    title: "Methodology and assumptions",
    plain: true,
    content: (
      <div style={{ display: "grid", gap: 14, color: "#5C5C5C", lineHeight: 1.7 }}>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A" }}>Prepayment savings formula</h3>
          <p style={{ margin: 0 }}>Prepayment savings are calculated by running two separate amortisation schedules using the reducing balance method — one with the lump sum prepayment applied today, one without. The difference in total interest paid across both schedules is your gross interest saving. Tenure reduction is calculated as the number of months by which the prepaid schedule reaches a zero balance earlier than the original schedule.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A" }}>Investment growth formula</h3>
          <p style={{ margin: 0 }}>The investment scenario models your lump sum as a one-time investment compounded annually at the chosen return rate: 7% for a conservative fixed deposit, 12% for moderate equity (aligned with Nifty 50 long-run median), or 15% for aggressive equity. FD returns are taxed at the user's applicable income slab rate. Equity returns are modelled with a 12.5% LTCG tax on gains above ₹1.25 lakh per year, per Union Budget 2024 rules. The investment corpus at the end of your remaining tenure is compared net of this tax.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A" }}>Data sources</h3>
          <p style={{ margin: 0 }}>Equity return benchmarks are based on Nifty 50 TRI rolling return data from January 1990 to March 2025 (source: NSE India). FD rates reflect the average 1-year SBI term deposit rate as of April 2026. RBI repo rate as of April 2026: 6.25%. Tax slabs reflect the new tax regime under Union Budget 2025.</p>
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px", fontSize: 16, color: "#1A1A1A" }}>What this tool does not model</h3>
          <p style={{ margin: 0 }}>This calculator does not account for: changes in your home loan interest rate over the remaining tenure, SIP-mode investment of the lump sum (models lump sum only), EMI amount changes post-prepayment (assumes tenure reduction), inflation adjustment on investment returns, or prepayment charges on fixed-rate loans. These factors can meaningfully change outcomes in your specific situation. For personalised planning, consult a SEBI-registered financial advisor.</p>
        </div>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "",
    plain: true,
    content: (
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ width: "100%", height: 1, background: "#E5E5E0" }} />
        <p style={{ margin: 0, lineHeight: 1.7, color: "#5C5C5C" }}>
          This calculator is for informational purposes only and does not constitute financial advice. Results are based on the assumptions listed above and may differ from actual outcomes. Please consult a SEBI-registered financial advisor before making investment or loan decisions.
        </p>
      </div>
    ),
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://kedil.money/" },
    { "@type": "ListItem", position: 2, name: "Calculators", item: "https://kedil.money/calculators" },
    { "@type": "ListItem", position: 3, name: "Prepay vs Invest Calculator", item: "https://kedil.money/calculators/prepay-vs-invest" },
  ],
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Prepay vs Invest Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description: metadata.description,
  url: "https://kedil.money/calculators/prepay-vs-invest",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to use the Prepay vs Invest Calculator",
  step: [
    { "@type": "HowToStep", name: "Enter your loan details", text: "Enter your Loan Outstanding, Interest Rate, and Remaining Tenure to set the base calculation." },
    { "@type": "HowToStep", name: "Add the surplus amount", text: "Type the Surplus Amount you want to prepay or invest." },
    { "@type": "HowToStep", name: "Set taxes and returns", text: "Choose your Tax Regime, Tax Slab, Expected MF Return, and Prepayment Charges." },
    { "@type": "HowToStep", name: "Toggle EMI reinvestment", text: "Switch on Freed EMI Reinvestment if you want to compare the freed EMI SIP strategy." },
    { "@type": "HowToStep", name: "Review the result", text: "See your savings summary and projection result to compare prepayment against investing." },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Should I prepay my home loan or invest in SIP in India?",
      acceptedAnswer: { "@type": "Answer", text: "Prepaying your home loan makes more financial sense when your interest rate is above 9% and you're in the first half of your tenure — the guaranteed interest saving beats a conservative FD or debt fund on a risk-adjusted basis. Investing in a SIP wins over the long run if your equity returns exceed your loan rate, which the Nifty 50 TRI has historically done at ~13% CAGR over 20+ years. The right answer depends on your specific loan rate, tenure remaining, and risk appetite — use this calculator to see your personal numbers before deciding." },
    },
    {
      "@type": "Question",
      name: "What is the best time to make a lump sum prepayment on a home loan?",
      acceptedAnswer: { "@type": "Answer", text: "The best time to prepay is in the early years of your loan — ideally within the first 5–8 years. EMIs in this period are heavily weighted toward interest, so prepaying principal now eliminates years of compounding interest. Prepayment in the final 3–4 years of a loan has much lower impact because most of the interest has already been paid through your regular EMIs." },
    },
    {
      "@type": "Question",
      name: "Does prepaying a home loan affect Section 80C or Section 24 tax benefits?",
      acceptedAnswer: { "@type": "Answer", text: "Prepayment reduces your outstanding principal, which reduces the interest component of your future EMIs — and a lower interest component means a smaller Section 24(b) deduction, currently capped at ₹2 lakh per year for self-occupied property. The principal repayment portion of your regular EMI remains eligible under Section 80C (up to ₹1.5 lakh), but a one-time lump sum prepayment made outside your regular EMI schedule is NOT eligible for Section 80C deduction." },
    },
    {
      "@type": "Question",
      name: "Is it better to reduce EMI or reduce tenure after prepayment?",
      acceptedAnswer: { "@type": "Answer", text: "Choosing tenure reduction saves you significantly more interest than reducing your EMI — it eliminates months or years of future interest accrual entirely. Choosing EMI reduction keeps your tenure the same, which means you pay interest for just as long. Unless you have a cash flow constraint and need the lower monthly outgo, tenure reduction is almost always the mathematically better option for Indian borrowers." },
    },
    {
      "@type": "Question",
      name: "Do Indian banks charge a prepayment penalty on home loans?",
      acceptedAnswer: { "@type": "Answer", text: "Floating rate home loans in India carry zero prepayment penalty — the RBI mandated this in 2012. If you're on a fixed-rate home loan, your lender may charge a foreclosure fee of 2–4% of the prepaid amount. Most borrowers in India are on floating rate loans linked to the repo rate (RLLR or MCLR), which means prepayment is completely free of charge." },
    },
    {
      "@type": "Question",
      name: "Is it better to prepay home loan or invest in FD in 2026?",
      acceptedAnswer: { "@type": "Answer", text: "Prepaying your home loan is typically better than an FD for borrowers on a rate above 8%, because the guaranteed interest saving on the loan outpaces the post-tax FD return. FD interest is taxed at your income slab rate — for someone in the 30% bracket, a 7% FD yields just 4.9% after tax. Your home loan interest rate is almost certainly higher than that, making prepayment the mathematically superior option in most cases in 2026." },
    },
    {
      "@type": "Question",
      name: "How does the home loan part payment calculator handle LTCG tax on investments?",
      acceptedAnswer: { "@type": "Answer", text: "Equity mutual fund returns held for more than 1 year are subject to Long Term Capital Gains (LTCG) tax at 12.5% on gains above ₹1.25 lakh per year, as updated in Union Budget 2024. The calculator applies this tax to the investment scenario so the comparison is on a post-tax basis — not a gross return basis that would flatter the investment option. FD returns are modelled at your applicable income tax slab rate." },
    },
    {
      "@type": "Question",
      name: "What does home loan prepayment vs SIP comparison actually mean?",
      acceptedAnswer: { "@type": "Answer", text: "The comparison is based on the opportunity cost principle — if you use ₹X to prepay your home loan, you save a fixed, guaranteed amount of interest over your remaining tenure. If you invest the same ₹X in a monthly SIP, you earn a variable, market-dependent return. This calculator models both scenarios using your actual loan figures and your chosen return assumption, then shows the net rupee difference — so you make the decision with data, not gut feel." },
    },
  ],
};

export default function Page() {
  return (
    <div style={{ background: "#F7F7F5" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PrepayVsInvestClient />

      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px 56px" }}>
        <style>{`
          #frequently-asked-questions summary::-webkit-details-marker { display: none; }
          #frequently-asked-questions details[open] summary span[aria-hidden="true"] { transform: rotate(180deg); }
          #frequently-asked-questions summary span[aria-hidden="true"] { transition: transform 0.2s ease; }
        `}</style>
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            style={{
              ...(section.plain ? plainSectionCard : section.white ? { ...sectionCard, background: "#FFFFFF" } : sectionCard),
              marginTop: index === 0 ? 20 : 28,
            }}
          >
            {section.title && <h2 style={{ margin: "0 0 14px", fontSize: 22, lineHeight: 1.25, color: "#1A1A1A", fontWeight: section.emphasis ? 800 : 700 }}>{section.title}</h2>}
            {section.content}
          </section>
        ))}

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #E5E5E0", fontSize: 11, color: "#9A9A9A", textAlign: "center", lineHeight: 1.6 }}>
          Built by <strong style={{ color: "#1A1A1A" }}>Kedil</strong> &middot; Educational tool, not financial advice. Tax rules FY 2024&ndash;25.
        </div>
      </main>
    </div>
  );
}
