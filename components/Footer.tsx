"use client";

import { Separator } from "@/components/ui/separator";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="w-full ">
      <div className="container mx-auto py-8 px-6 md:px-12">
        {/* Footer Content */}
        {/* <div className="flex flex-col md:flex-row justify-between gap-8"> */}
          {/* Brand & Description */}
          {/* <div>
            <h2 className="text-2xl font-bold text-gray-900">SinityCourse</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Platform rekomendasi kursus berbasis AI yang membantu Anda menemukan kursus terbaik sesuai kebutuhan dan keahlian Anda.
            </p>
          </div> */}

          {/* Navigation Links */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li><a href="/about" className="hover:text-gray-900">About Us</a></li>
                <li><a href="/careers" className="hover:text-gray-900">Careers</a></li>
                <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li><a href="/blog" className="hover:text-gray-900">Blog</a></li>
                <li><a href="/faq" className="hover:text-gray-900">FAQ</a></li>
                <li><a href="/support" className="hover:text-gray-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li><a href="/terms" className="hover:text-gray-900">Terms</a></li>
                <li><a href="/privacy" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="/cookies" className="hover:text-gray-900">Cookies</a></li>
              </ul>
            </div>
          </div> */}
        {/* </div> */}

        {/* Separator */}
        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} SinityCourse. All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}
