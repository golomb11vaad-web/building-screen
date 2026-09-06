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
export type MessageTextSize = 'small' | 'normal' | 'large';

export type ImageSource = 'upload' | 'curated';

export interface ImageRef {
	id: string;
	source: ImageSource;
	ref: string;
}

export interface AmbientBackground {
	id: string;
	label: string;
	src: string;
}

export interface BackgroundMusic {
	id: string;
	label: string;
	src: string;
}

export interface Message {
	id: string;
	text: string;
	style: MessageStyle;
	textSize?: MessageTextSize;
	images?: ImageRef[];
	pinned: boolean;
	enabled?: boolean;
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

export interface WeatherData {
	temperatureCurrent: number;
	temperatureMax: number;
	temperatureMin: number;
	weatherCode: number;
	conditionLabel: string;
	fetchedAt: string;
	forecast: ForecastDay[];
}

export interface ForecastDay {
	date: string;
	weatherCode: number;
	temperatureMax: number;
	temperatureMin: number;
}

export interface NewsItem {
	title: string;
	source: 'Ynet' | 'Calcalist' | 'Globes';
	link: string;
	publishedAt: string;
}

export interface HebrewDateData {
	hebrew: string;
	parasha: string | null;
}

export interface FinanceItem {
	label: string;
	value: string;
	change: string;
}
