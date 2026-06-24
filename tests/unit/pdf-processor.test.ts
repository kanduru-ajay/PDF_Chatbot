// ============================================
// Unit Tests - PDF Processor
// ============================================

import { describe, it, expect } from "vitest";
import { chunkText, validatePDF } from "@/lib/pdf-processor";

describe("PDF Processor", () => {
  describe("chunkText", () => {
    it("should split text into chunks of appropriate size", () => {
      const text = "This is a test sentence. ".repeat(500);
      const chunks = chunkText(text, "doc-1", "test.pdf");

      expect(chunks.length).toBeGreaterThan(0);
      chunks.forEach((chunk) => {
        expect(chunk.content.length).toBeLessThanOrEqual(1200); // CHUNK_SIZE + buffer
        expect(chunk.metadata.documentId).toBe("doc-1");
        expect(chunk.metadata.documentName).toBe("test.pdf");
      });
    });

    it("should handle empty text", () => {
      const chunks = chunkText("", "doc-1", "test.pdf");
      expect(chunks.length).toBe(0);
    });

    it("should handle short text as single chunk", () => {
      const text = "This is a short text.";
      const chunks = chunkText(text, "doc-1", "test.pdf");
      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toBe(text);
    });

    it("should include proper metadata in each chunk", () => {
      const text = "First sentence. Second sentence. ".repeat(200);
      const chunks = chunkText(text, "doc-123", "report.pdf");

      chunks.forEach((chunk, idx) => {
        expect(chunk.metadata.documentId).toBe("doc-123");
        expect(chunk.metadata.documentName).toBe("report.pdf");
        expect(chunk.metadata.chunkIndex).toBe(idx);
        expect(typeof chunk.metadata.page).toBe("number");
      });
    });
  });

  describe("validatePDF", () => {
    it("should accept valid PDF files", () => {
      const file = { size: 1024 * 1024, type: "application/pdf" };
      const result = validatePDF(file);
      expect(result.valid).toBe(true);
    });

    it("should reject files over 50MB", () => {
      const file = { size: 51 * 1024 * 1024, type: "application/pdf" };
      const result = validatePDF(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("50MB");
    });

    it("should reject non-PDF files", () => {
      const file = { size: 1024, type: "text/plain" };
      const result = validatePDF(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("PDF");
    });

    it("should reject empty files", () => {
      const file = { size: 0, type: "application/pdf" };
      const result = validatePDF(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("empty");
    });

    it("should accept files without type (some browsers)", () => {
      const file = { size: 1024 * 1024, type: "" };
      const result = validatePDF(file);
      expect(result.valid).toBe(true);
    });
  });
});
