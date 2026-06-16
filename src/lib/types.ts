export type Weekday =
	| 'sunday'
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday';

export const WEEKDAYS: Weekday[] = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
];

export type MessageStyle = 'plain' | 'photoSlideshow' | 'background';

export type ImageSource = 'upload' | 'curated';

export interface ImageRef {
	id: string;
	source: ImageSource;
	ref: string;
}

export interface Message {
	id: string;
	text: string;
	style: MessageStyle;
	images?: ImageRef[];
	pinned: boolean;
	createdAt: string;
	updatedAt: string;
	expiresAt?: string;
	activeDays?: Weekday[];
	activeFrom?: string;
	activeUntil?: string;
}

export interface CuratedBackground {
	id: string;
	label: string;
	css: string;
}
