"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  delay?: number;
}

export function Testimonial({
  name,
  role,
  content,
  rating,
  delay = 0,
}: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.2, 0.8, 0.2, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-bg-elevated rounded-lg p-lg h-full border border-border-default"
    >
      {/* Rating */}
      <div className="flex gap-xs mb-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating
                ? "fill-accent-yellow text-accent-yellow"
                : "text-border-default"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-fg-default leading-normal mb-md">
        {content}
      </p>

      {/* Author */}
      <div>
        <p className="font-semibold text-fg-default">{name}</p>
        <p className="text-sm text-fg-muted">{role}</p>
      </div>
    </motion.div>
  );
}
