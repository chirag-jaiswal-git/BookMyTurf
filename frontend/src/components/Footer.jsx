import { Link } from "react-router-dom";
import React from "react";
export default function Footer() {
  return (
    <footer className="bg-white mt-auto text-emerald-900">
      
      {/* Bottom Bar */}
      <div className=" text-center py-3 text-lg font-semibold">
        © {new Date().getFullYear()} bookMyTurf. All Rights Reserved.
      </div>
    </footer>
  );
}
