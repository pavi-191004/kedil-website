"use client";

import dynamic from "next/dynamic";

const PrepayVsInvest = dynamic(
  () => import("@/app/calculators/prepay-vs-invest/PrepayVsInvest"),
  { ssr: false }
);

export default function PrepayVsInvestCalculator() {
  return <PrepayVsInvest />;
}
