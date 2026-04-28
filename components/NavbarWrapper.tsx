"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = !pathname.includes("/calculators/prepay-vs-invest");

  return showNavbar ? <Navbar /> : null;
}