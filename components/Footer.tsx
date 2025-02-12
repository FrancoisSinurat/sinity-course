"use client"
import { Typography } from "@material-tailwind/react/components/Typography";

 
const currentYear = new Date().getFullYear();
 
export function FooterWithSitemap() {
  return (
    <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-6 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <Typography color="blue-gray" className="font-normal">
        &copy; {currentYear} SinityCourse. All rights reserved.
      </Typography>
      
    </footer>
  );
}