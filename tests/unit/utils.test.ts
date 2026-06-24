// ============================================
// Unit Tests - Utility Functions
// ============================================

import { describe, it, expect } from "vitest";
import { cn, formatDate, formatFileSize, truncate, slugify } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn (class merger)", () => {
    it("should merge class names correctly", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toBe("py-1 px-4");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base", isActive && "active");
      expect(result).toBe("base active");
    });

    it("should handle falsy values", () => {
      const result = cn("base", false && "hidden", null, undefined);
      expect(result).toBe("base");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toContain("Jan");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should handle string dates", () => {
      const result = formatDate("2024-06-20T14:00:00Z");
      expect(result).toContain("Jun");
      expect(result).toContain("20");
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1 MB");
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("should handle decimal values", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      const result = truncate("Hello World", 5);
      expect(result).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      const result = truncate("Hi", 10);
      expect(result).toBe("Hi");
    });
  });

  describe("slugify", () => {
    it("should convert to slug format", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("PDF Document (2024)")).toBe("pdf-document-2024");
      expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
    });

    it("should handle special characters", () => {
      expect(slugify("Test@#$%File")).toBe("testfile");
    });
  });
});
