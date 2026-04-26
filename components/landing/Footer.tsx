"use client";

import { useState } from "react";
import { Github, Twitter, ChevronDown } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Find Roommates", href: "#" },
    { name: "Escrow Dashboard", href: "#" },
    { name: "Payment History", href: "#" },
    { name: "Rent Builder", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Stellar Docs", href: "https://developers.stellar.org" },
    { name: "API Reference", href: "#" },
    { name: "Contributing", href: "/CONTRIBUTING.md" },
  ],
  Community: [
    { name: "GitHub", href: "https://github.com/Ogstevyn/payeasy" },
    { name: "Discord", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Blog", href: "#" },
  ],
};

interface AccordionState {
  [key: string]: boolean;
}

export default function Footer() {
  const [expandedCategories, setExpandedCategories] = useState<AccordionState>({
    Product: true,
    Resources: true,
    Community: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <footer className="border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold text-white">
                Pay<span className="gradient-text">Easy</span>
              </span>
            </Link>
            <p className="text-dark-500 text-sm leading-relaxed mb-5 max-w-xs">
              Blockchain-powered rent sharing. Find roommates, split rent, pay
              through Stellar escrow.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ogstevyn/payeasy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-400 hover:text-white hover:border-brand-500/30 transition-all"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-dark-400 hover:text-white hover:border-brand-500/30 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Link Columns - Accordion on mobile, regular grid on desktop */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:block">
              {/* Mobile accordion header */}
              <button
                onClick={() => toggleCategory(category)}
                className="lg:hidden w-full flex items-center justify-between mb-3"
                aria-expanded={expandedCategories[category]}
              >
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {category}
                </h4>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    expandedCategories[category] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop header (always visible) */}
              <h4 className="hidden lg:block text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {category}
              </h4>

              {/* Link list - collapsible on mobile */}
              <ul
                className={`space-y-3 lg:block ${
                  expandedCategories[category] ? "block" : "hidden"
                }`}
              >
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-dark-500 hover:text-dark-300 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-600 text-xs">
            &copy; {new Date().getFullYear()} PayEasy. Open source under MIT License.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-dark-600 hover:text-dark-400 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-dark-600 hover:text-dark-400 text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
