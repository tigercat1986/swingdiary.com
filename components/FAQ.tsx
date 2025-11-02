"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import homeData from "@/content/home.json";
import { Section } from "./Section";

export function FAQ() {
  const { faq } = homeData;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="faq">
      <div className="container max-w-container mx-auto px-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-xl"
        >
          <h2 className="text-h3 md:text-h2 font-bold mb-lg text-fg-default">
            常见问题
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-md">
          {faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-bg-elevated rounded-lg border border-border-default overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-lg text-left hover:bg-bg-subtle transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-fg-default pr-lg">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-fg-muted flex-shrink-0 transition-transform duration-base ease ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <p className="px-lg pb-lg text-fg-muted leading-normal">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

