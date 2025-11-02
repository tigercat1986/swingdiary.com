import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FeatureCard } from "@/components/FeatureCard";
import { Activity } from "lucide-react";

describe("FeatureCard", () => {
  it("renders feature card with all props", () => {
    render(
      <FeatureCard
        icon={Activity}
        title="Test Feature"
        description="Test description"
      />
    );
    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("is a link element", () => {
    render(
      <FeatureCard
        icon={Activity}
        title="Test"
        description="Test"
        link="/test"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test");
  });
});

