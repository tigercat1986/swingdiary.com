"use client";

import React from "react";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";
import { Testimonial } from "@/components/Testimonial";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import homeData from "@/content/home.json";
import {
  Activity,
  PencilRuler,
  Calendar,
  User,
  Sparkles,
  Users,
} from "lucide-react";

const iconMap = {
  Activity,
  PencilRuler,
  Calendar,
  User,
  Sparkles,
  Users,
};

export default function Home() {
  const { features, testimonials } = homeData;

  return (
    <>
      <Hero />
      
      {/* Features Section */}
      <Section id="features">
        <div className="container max-w-container mx-auto px-md">
          <div className="text-center mb-xl">
            <h2 className="text-h3 md:text-h2 font-bold mb-lg text-fg-default">
              核心功能
            </h2>
            <p className="text-lg text-fg-muted max-w-2xl mx-auto">
              为网球爱好者量身定制的专业工具
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <FeatureCard
                  key={feature.title}
                  icon={Icon}
                  title={feature.title}
                  description={feature.description}
                  link={feature.link}
                  delay={index * 0.1}
                />
              );
            })}
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="bg-bg-subtle">
        <div className="container max-w-container mx-auto px-md">
          <div className="text-center mb-xl">
            <h2 className="text-h3 md:text-h2 font-bold mb-lg text-fg-default">
              用户评价
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={testimonial.name}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                rating={testimonial.rating}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </Section>

      <Pricing />
      <FAQ />
    </>
  );
}

