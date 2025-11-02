"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "功能特色", href: "#features" },
    { label: "下载", href: "#download" },
    { label: "常见问题", href: "#faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-base ease ${
        isScrolled
          ? "bg-bg-elevated shadow-md backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container max-w-container mx-auto px-md py-md flex items-center justify-between"
        role="navigation"
        aria-label="主导航"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
          aria-label="回到首页"
        >
          网球拍档
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-fg-default hover:text-brand-primary transition-colors duration-base ease font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="#download">
              <Download className="mr-xs" size={18} />
              立即下载
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-xs text-fg-default hover:text-brand-primary transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="打开菜单"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden bg-bg-elevated border-t border-border-default"
          >
            <div className="container max-w-container mx-auto px-md py-md flex flex-col gap-md">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-fg-default hover:text-brand-primary transition-colors duration-base ease font-medium py-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                className="w-full mt-sm"
                asChild
              >
                <Link href="#download">
                  <Download className="mr-xs" size={18} />
                  立即下载
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

