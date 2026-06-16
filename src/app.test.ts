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
		expect(css).toContain('--color-bg');
		expect(css).toContain('--color-pinned-accent');
		expect(css).toContain('--font-size-message');
		expect(css).toContain('--motion-slideshow');
	});
});
