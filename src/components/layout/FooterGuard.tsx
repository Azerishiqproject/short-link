"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterGuard() {
  const pathname = usePathname();
  if (pathname === "/secret-dashboard" || pathname === "/panel") return null;
  return <Footer />;
}


