import type { AmbientBackground, BackgroundMusic } from './types';

export const DEFAULT_AMBIENT_BACKGROUNDS: AmbientBackground[] = [
	{ id: 'courtyard', label: 'חצר בוקר', src: '/ambient/courtyard-morning.png' },
	{ id: 'coast', label: 'חוף בין הערביים', src: '/ambient/coast-blue-hour.png' },
	{ id: 'garden', label: 'גינה אחרי הגשם', src: '/ambient/garden-after-rain.png' }
];

export const DEFAULT_BUILDING_PHOTO: AmbientBackground = {
	id: 'golomb-11-building',
	label: 'גולומב 11, נהריה',
	src: '/uploads/golomb-11-building.jpg'
};

export const DEFAULT_BACKGROUND_MUSIC: BackgroundMusic = {
	id: 'lobby-music',
	label: 'מוזיקת לובי',
	src: '/uploads/lobby-music.mp3'
};
