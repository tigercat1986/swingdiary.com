"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Download, Play } from "lucide-react";
import homeData from "@/content/home.json";

export function Hero() {
  const { hero } = homeData;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-subtle"
      aria-label="主要介绍区域"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />

      <div className="container max-w-container mx-auto px-md relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <motion.h1
              className="text-h2 md:text-h1 font-bold leading-tight mb-lg text-fg-default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              className="text-xl md:text-h5 text-fg-muted mb-xl leading-snug"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {hero.subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Button
                size="lg"
                asChild
                className="text-lg px-xl"
              >
                <a href={hero.primaryCTALink}>
                  <Download className="mr-xs" size={20} />
                  {hero.primaryCTA}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-xl"
              >
                <a href={hero.secondaryCTALink}>
                  <Play className="mr-xs" size={20} />
                  {hero.secondaryCTA}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl p-1 shadow-lg">
              <div className="w-full h-full bg-fg-default rounded-xl overflow-hidden">
                {/* Placeholder for app screenshot */}
                <div className="w-full h-full flex items-center justify-center text-fg-inverse">
                  <div className="text-center">
                    <div className="text-6xl mb-md">🎾</div>
                    <p className="text-sm">应用截图占位</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

