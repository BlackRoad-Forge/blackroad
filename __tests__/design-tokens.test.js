import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const tokensPath = resolve(__dirname, '../blackroad/design-tokens.json');
const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));

describe('Design tokens', () => {
  it('is valid parseable JSON', () => {
    expect(tokens).toBeDefined();
    expect(typeof tokens).toBe('object');
  });

  // ── Colors ──────────────────────────────────────────────────────

  describe('colors', () => {
    const requiredColors = [
      'primary',
      'secondary',
      'accent',
      'neutral',
      'info',
      'danger',
      'warning',
      'success',
    ];

    it('has a color section', () => {
      expect(tokens.color).toBeDefined();
    });

    it.each(requiredColors)('defines the "%s" color', (name) => {
      expect(tokens.color[name]).toBeDefined();
    });

    it.each(requiredColors)('"%s" is a valid hex color', (name) => {
      expect(tokens.color[name]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  // ── Fonts ───────────────────────────────────────────────────────

  describe('fonts', () => {
    it('has a font section', () => {
      expect(tokens.font).toBeDefined();
    });

    it('defines sans and mono font families', () => {
      expect(tokens.font.family.sans).toBeDefined();
      expect(tokens.font.family.mono).toBeDefined();
    });

    it('has standard font sizes', () => {
      const requiredSizes = ['xs', 'sm', 'base', 'lg', 'xl'];
      for (const size of requiredSizes) {
        expect(tokens.font.size[size]).toBeDefined();
        expect(tokens.font.size[size]).toMatch(/^\d+(\.\d+)?rem$/);
      }
    });

    it('has standard font weights', () => {
      expect(tokens.font.weight.normal).toBe(400);
      expect(tokens.font.weight.medium).toBe(500);
      expect(tokens.font.weight.bold).toBe(700);
    });

    it('font sizes are in ascending order', () => {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
      const values = sizes.map((s) => parseFloat(tokens.font.size[s]));
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });

  // ── Border radius ──────────────────────────────────────────────

  describe('border radius', () => {
    it('has a radius section', () => {
      expect(tokens.radius).toBeDefined();
    });

    const requiredRadii = ['none', 'sm', 'md', 'lg', 'xl', 'full'];

    it.each(requiredRadii)('defines the "%s" radius', (name) => {
      expect(tokens.radius[name]).toBeDefined();
    });

    it('"none" radius is "0"', () => {
      expect(tokens.radius.none).toBe('0');
    });

    it('"full" radius is a very large value', () => {
      expect(parseFloat(tokens.radius.full)).toBeGreaterThan(100);
    });

    it('radii are in ascending order (excluding full)', () => {
      const ordered = ['none', 'sm', 'md', 'lg', 'xl'];
      const values = ordered.map((r) => parseFloat(tokens.radius[r]));
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });
});
