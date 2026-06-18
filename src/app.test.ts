import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RTL/Hebrew shell and design tokens', () => {
	it('declares Hebrew language and right-to-left direction', () => {
		const html = readFileSync('src/app.html', 'utf-8');
		expect(html).toContain('lang="he"');
		expect(html).toContain('dir="rtl"');
	});

	it('defines the base design tokens', () => {
		const css = readFileSync('src/app.css', 'utf-8');
		expect(css).toContain('--color-surface');
		expect(css).toContain('--color-primary');
		expect(css).toContain('--text-display-lg');
		expect(css).toContain('--motion-fade');
	});
});
