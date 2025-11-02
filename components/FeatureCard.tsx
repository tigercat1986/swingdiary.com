"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  link = "#",
  delay = 0,
}: FeatureCardProps) {
  const MotionLink = motion(Link);

  return (
    <MotionLink
      href={link}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group block h-full"
    >
      <div className="bg-bg-elevated rounded-lg p-lg h-full border border-border-default hover:border-brand-primary transition-all duration-base ease hover:shadow-md group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-brand-primary">
        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-md group-hover:bg-brand-primary/20 transition-colors duration-base ease">
          <Icon size={24} className="text-brand-primary" />
        </div>
        <h3 className="text-h6 font-semibold mb-sm text-fg-default group-hover:text-brand-primary transition-colors duration-base ease">
          {title}
        </h3>
        <p className="text-fg-muted leading-normal">
          {description}
        </p>
      </div>
    </MotionLink>
  );
}

