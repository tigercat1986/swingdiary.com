import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("renders hero section", () => {
    render(<Hero />);
    expect(screen.getByRole("region", { name: "主要介绍区域" })).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByText("立即下载")).toBeInTheDocument();
    expect(screen.getByText("了解更多")).toBeInTheDocument();
  });
});

