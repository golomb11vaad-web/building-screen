import { CURATED_BACKGROUNDS } from './curatedBackgrounds';
import type { ImageRef } from './types';

export function resolveBackgroundCss(image: ImageRef): string {
	if (image.source === 'curated') {
		return CURATED_BACKGROUNDS.find((bg) => bg.id === image.ref)?.css ?? '';
	}
	return `url('/uploads/${image.ref}')`;
}
