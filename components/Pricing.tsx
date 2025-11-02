"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import homeData from "@/content/home.json";
import { Section } from "./Section";

export function Pricing() {
  const { pricing } = homeData;

  return (
    <Section id="download" className="bg-bg-subtle">
      <div className="container max-w-container mx-auto px-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-xl"
        >
          <h2 className="text-h3 md:text-h2 font-bold mb-lg text-fg-default">
            {pricing.title}
          </h2>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            {pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-4xl mx-auto">
          {pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className={`bg-bg-elevated rounded-lg p-xl border-2 ${
                index === 1
                  ? "border-brand-primary shadow-lg"
                  : "border-border-default"
              }`}
            >
              <div className="mb-lg">
                <h3 className="text-h5 font-bold mb-sm text-fg-default">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-xs">
                  <span className="text-h3 font-bold text-fg-default">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-fg-muted">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-md mb-xl">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-sm">
                    <Check
                      size={20}
                      className="text-brand-primary flex-shrink-0 mt-0.5"
                    />
                    <span className="text-fg-default">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                variant={index === 1 ? "primary" : "outline"}
                className="w-full"
                asChild
              >
                <a href="#">
                  {index === 1 ? "开始订阅" : "免费使用"}
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

