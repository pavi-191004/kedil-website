"use client";

import dynamic from "next/dynamic";

const PrepayVsInvest = dynamic(() => import("./PrepayVsInvest"), {
  ssr: false,
});

export default function PrepayVsInvestClient() {
  return <PrepayVsInvest />;
}
