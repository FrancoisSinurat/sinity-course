"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter = pathname === "/" || pathname === "/login" || pathname === "/register" ;

  return !hideFooter ? <Footer /> : null;
}
