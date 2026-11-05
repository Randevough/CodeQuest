import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PipelineSection, PIPELINE_STEPS } from "@/components/landing/PipelineSection";
import {
  QuestBubble,
  formatCategoryPill,
  getDifficultyStars,
} from "@/components/landing/QuestBubble";
import {
  QuestShowcaseSection,
  FALLBACK_TEASERS,
} from "@/components/landing/QuestShowcaseSection";

describe("getDifficultyStars helper", () => {
  it("maps beginner/pemula to ★☆☆", () => {
    expect(getDifficultyStars("Beginner")).toBe("★☆☆");
    expect(getDifficultyStars("pemula")).toBe("★☆☆");
    expect(getDifficultyStars(undefined)).toBe("★☆☆");
  });

  it("maps intermediate/menengah to ★★☆", () => {
    expect(getDifficultyStars("Intermediate")).toBe("★★☆");
    expect(getDifficultyStars("menengah")).toBe("★★☆");
  });

  it("maps advanced/mahir to ★★★", () => {
    expect(getDifficultyStars("Advanced")).toBe("★★★");
    expect(getDifficultyStars("mahir")).toBe("★★★");
  });
});

describe("formatCategoryPill helper", () => {
  it("formats category and difficulty correctly", () => {
    expect(formatCategoryPill("Web", "Beginner")).toBe("WEB • PEMULA");
    expect(formatCategoryPill("AI", "Intermediate")).toBe("AI • MENENGAH");
    expect(formatCategoryPill("Mobile", "Advanced")).toBe("MOBILE • MAHIR");
    expect(formatCategoryPill("Web", "Pemula")).toBe("WEB • PEMULA");
    expect(formatCategoryPill("Cloud")).toBe("CLOUD");
  });
});

describe("PipelineSection", () => {
  it("renders the main headline", () => {
    render(<PipelineSection />);
    const heading = screen.getByRole("heading", {
      name: /Empat Langkah Menuju Kode Terverifikasi/i,
    });
    expect(heading).toBeTruthy();
  });

  it("renders all 4 pipeline steps with correct titles and descriptions", () => {
    render(<PipelineSection />);

    expect(screen.getByText("01. Kunci Quest")).toBeTruthy();
    expect(screen.getByText("02. Bangun Solusi")).toBeTruthy();
    expect(screen.getByText("03. Kirim Repositori")).toBeTruthy();
    expect(screen.getByText("04. Buka Reward")).toBeTruthy();

    for (const step of PIPELINE_STEPS) {
      expect(screen.getByText(step.description)).toBeTruthy();
      const badge = screen.getByTestId(`step-badge-${step.step}`);
      expect(badge.textContent?.trim()).toBe(step.level);
    }
  });

  it("applies Soft Arcade styling to cards and step badges", () => {
    render(<PipelineSection />);

    const firstCard = screen.getByTestId("pipeline-step-01");
    expect(firstCard.className).toContain("bg-[#20283A]");
    expect(firstCard.className).toContain("border-[#2E3A52]");

    const firstBadge = screen.getByTestId("step-badge-01");
    expect(firstBadge.className).toContain("bg-[#FFAE58]");
    expect(firstBadge.className).toContain("text-[#141925]");
  });
});

describe("QuestBubble", () => {
  const sampleQuest = {
    id: "sample-1",
    title: "Full-Stack Task Runner",
    description: "Build a robust background task processing pipeline.",
    category: "Web",
    difficulty: "Beginner",
    points: 150,
  };

  it("renders stacked bubble with background tab and foreground card", () => {
    render(<QuestBubble quest={sampleQuest} />);

    const tab = screen.getByTestId("quest-bubble-tab");
    expect(tab.className).toContain("bg-[#20283A]");

    const card = screen.getByTestId("quest-bubble-card");
    expect(card.className).toContain("bg-[#FFF3DE]");
    expect(card.className).toContain("border-[#141925]");
  });

  it("renders header with category pill, difficulty stars, and points chip", () => {
    render(<QuestBubble quest={sampleQuest} />);

    expect(screen.getByTestId("category-pill").textContent?.trim()).toBe("WEB • PEMULA");
    expect(screen.getByTestId("difficulty-stars").textContent?.trim()).toBe("★☆☆");
    expect(screen.getByTestId("points-chip").textContent?.trim()).toBe("+150 PTS");
    expect(screen.getByTestId("points-chip").className).toContain("font-black");
    expect(screen.getByTestId("points-chip").className).toContain("bg-[#141925]");
    expect(screen.getByTestId("points-chip").className).toContain("text-[#FFF3DE]");
  });

  it("renders quest title and description with 2-line clamp", () => {
    render(<QuestBubble quest={sampleQuest} />);

    const titleEl = screen.getByRole("heading", { name: "Full-Stack Task Runner" });
    expect(titleEl).toBeTruthy();
    expect(titleEl.className).toContain("text-[#141925]");

    const descEl = screen.getByText("Build a robust background task processing pipeline.");
    expect(descEl).toBeTruthy();
    expect(descEl.className).toContain("line-clamp-2");
  });

  it("renders full pill button 'Lihat quest' with tactile styling", () => {
    render(<QuestBubble quest={sampleQuest} />);

    const button = screen.getByRole("link", { name: /Lihat quest/i });
    expect(button).toBeTruthy();
    expect(button.getAttribute("href")).toBe("/quests/sample-1");
    expect(button.className).toContain("rounded-full");
    expect(button.className).toContain("bg-[#141925]");
    expect(button.className).toContain("text-[#FFF3DE]");
    expect(button.className).toContain("shadow-[0_3px_0_#2E3A52]");
  });

  it("supports individual props as fallback when quest object is not provided", () => {
    render(
      <QuestBubble
        id="prop-quest"
        title="AI Evaluation Harness"
        description="Run automated benchmarks on LLMs."
        category="AI"
        difficulty="Intermediate"
        points={400}
      />
    );

    expect(screen.getByRole("heading", { name: "AI Evaluation Harness" })).toBeTruthy();
    expect(screen.getByTestId("category-pill").textContent?.trim()).toBe("AI • MENENGAH");
    expect(screen.getByTestId("difficulty-stars").textContent?.trim()).toBe("★★☆");
    expect(screen.getByTestId("points-chip").textContent?.trim()).toBe("+400 PTS");
  });
});

describe("QuestShowcaseSection", () => {
  it("renders 3 FALLBACK_TEASERS when quests prop is undefined", () => {
    render(<QuestShowcaseSection />);

    expect(screen.getByRole("heading", { name: "Web Task Runner" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "AI Benchmark Suite" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mobile Campus Scanner" })).toBeTruthy();

    expect(screen.getByText("+250 PTS")).toBeTruthy();
    expect(screen.getByText("+400 PTS")).toBeTruthy();
    expect(screen.getByText("+150 PTS")).toBeTruthy();
  });

  it("renders empty state when quests prop is empty array", () => {
    render(<QuestShowcaseSection quests={[]} />);

    expect(screen.getByTestId("quests-empty-state")).toBeTruthy();
    expect(screen.getByText("Belum ada quest aktif musim ini")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Web Task Runner" })).toBeNull();
  });

  it("renders custom quests when provided", () => {
    const customQuests = [
      {
        id: "custom-1",
        title: "Custom Security Audit",
        description: "Perform penetration testing on auth routes.",
        category: "Security",
        difficulty: "Advanced",
        points: 500,
      },
    ];

    render(<QuestShowcaseSection quests={customQuests} />);

    expect(screen.getByRole("heading", { name: "Custom Security Audit" })).toBeTruthy();
    expect(screen.queryByText("Web Task Runner")).toBeNull();
    expect(screen.getByText("+500 PTS")).toBeTruthy();
  });

  it("renders eyebrow, section heading, and view all link", () => {
    render(<QuestShowcaseSection />);

    expect(screen.getByText("KATALOG MISI PILIHAN")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /Tantangan Nyata yang Menunggu Diselesaikan/i })
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /Lihat Semua Quest/i }).getAttribute("href")).toBe(
      "/explore"
    );
  });

  it("renders interactive category filter pills with correct active and inactive styling", () => {
    render(<QuestShowcaseSection />);

    const pillSemua = screen.getByTestId("filter-pill-semua");
    const pillWeb = screen.getByTestId("filter-pill-web");
    const pillAi = screen.getByTestId("filter-pill-ai");
    const pillMobile = screen.getByTestId("filter-pill-mobile");

    expect(pillSemua.textContent).toBe("[ SEMUA (3) ]");
    expect(pillWeb.textContent).toBe("[ WEB (1) ]");
    expect(pillAi.textContent).toBe("[ AI (1) ]");
    expect(pillMobile.textContent).toBe("[ MOBILE (1) ]");

    // Default SEMUA active
    expect(pillSemua.className).toContain("bg-[#FFAE58]");
    expect(pillSemua.className).toContain("text-[#141925]");
    expect(pillSemua.className).toContain("font-bold");
    expect(pillSemua.className).toContain("shadow-[0_2px_0_#C27A29]");

    // Other pills inactive
    expect(pillWeb.className).toContain("bg-[#20283A]");
    expect(pillWeb.className).toContain("text-[#C2C7D0]");
    expect(pillWeb.className).toContain("border-[#2E3A52]");

    // All 3 default quests displayed
    expect(screen.getByRole("heading", { name: "Web Task Runner" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "AI Benchmark Suite" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mobile Campus Scanner" })).toBeTruthy();
  });

  it("filters displayed quests immediately when clicking category pills", () => {
    render(<QuestShowcaseSection />);

    // Click [ WEB ]
    fireEvent.click(screen.getByTestId("filter-pill-web"));
    expect(screen.getByRole("heading", { name: "Web Task Runner" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "AI Benchmark Suite" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Mobile Campus Scanner" })).toBeNull();

    // Click [ AI ]
    fireEvent.click(screen.getByTestId("filter-pill-ai"));
    expect(screen.queryByRole("heading", { name: "Web Task Runner" })).toBeNull();
    expect(screen.getByRole("heading", { name: "AI Benchmark Suite" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Mobile Campus Scanner" })).toBeNull();

    // Click [ MOBILE ]
    fireEvent.click(screen.getByTestId("filter-pill-mobile"));
    expect(screen.queryByRole("heading", { name: "Web Task Runner" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "AI Benchmark Suite" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Mobile Campus Scanner" })).toBeTruthy();

    // Click [ SEMUA ] to reset
    fireEvent.click(screen.getByTestId("filter-pill-semua"));
    expect(screen.getByRole("heading", { name: "Web Task Runner" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "AI Benchmark Suite" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Mobile Campus Scanner" })).toBeTruthy();
  });

  it("computes category counts dynamically based on provided quests", () => {
    const customQuests = [
      { id: "q1", title: "Q1", description: "D1", category: "Web", points: 100 },
      { id: "q2", title: "Q2", description: "D2", category: "Web", points: 200 },
      { id: "q3", title: "Q3", description: "D3", category: "Mobile", points: 300 },
    ];
    render(<QuestShowcaseSection quests={customQuests} />);

    expect(screen.getByTestId("filter-pill-semua").textContent).toBe("[ SEMUA (3) ]");
    expect(screen.getByTestId("filter-pill-web").textContent).toBe("[ WEB (2) ]");
    expect(screen.getByTestId("filter-pill-ai").textContent).toBe("[ AI (0) ]");
    expect(screen.getByTestId("filter-pill-mobile").textContent).toBe("[ MOBILE (1) ]");
  });
});
