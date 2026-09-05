import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DEFAULT_AMBIENT_BACKGROUNDS, DEFAULT_BACKGROUND_MUSIC, DEFAULT_BUILDING_PHOTO } from '$lib/ambientBackgrounds';
import type { AmbientBackground, BackgroundMusic } from '$lib/types';

const DATA_PATH = resolve('data/ambient-backgrounds.json');
const BUILDING_PHOTO_PATH = resolve('data/building-photo.json');
const BACKGROUND_MUSIC_PATH = resolve('data/background-music.json');

function loadLocalBackgrounds(): AmbientBackground[] {
	if (!existsSync(DATA_PATH)) return DEFAULT_AMBIENT_BACKGROUNDS;
	return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) as AmbientBackground[];
}

export async function loadAmbientBackgrounds(database?: D1Database): Promise<AmbientBackground[]> {
	if (!database) return loadLocalBackgrounds();
	const state = await database
		.prepare('SELECT ambient_json FROM screen_state WHERE id = 1')
		.first<{ ambient_json: string | null }>();
	if (!state?.ambient_json) return DEFAULT_AMBIENT_BACKGROUNDS;
	return JSON.parse(state.ambient_json) as AmbientBackground[];
}

export async function saveAmbientBackgrounds(
	backgrounds: AmbientBackground[],
	database?: D1Database
): Promise<void> {
	if (!database) {
		mkdirSync(dirname(DATA_PATH), { recursive: true });
		writeFileSync(DATA_PATH, JSON.stringify(backgrounds, null, 2), 'utf-8');
		return;
	}

	await database
		.prepare('UPDATE screen_state SET ambient_json = ?, updated_at = ? WHERE id = 1')
		.bind(JSON.stringify(backgrounds), new Date().toISOString())
		.run();
}

export async function loadBuildingPhoto(database?: D1Database): Promise<AmbientBackground> {
	if (!database) {
		if (!existsSync(BUILDING_PHOTO_PATH)) return DEFAULT_BUILDING_PHOTO;
		return JSON.parse(readFileSync(BUILDING_PHOTO_PATH, 'utf-8')) as AmbientBackground;
	}
	const state = await database
		.prepare('SELECT building_photo_json FROM screen_state WHERE id = 1')
		.first<{ building_photo_json: string | null }>();
	return state?.building_photo_json
		? (JSON.parse(state.building_photo_json) as AmbientBackground)
		: DEFAULT_BUILDING_PHOTO;
}

export async function saveBuildingPhoto(photo: AmbientBackground, database?: D1Database): Promise<void> {
	if (!database) {
		mkdirSync(dirname(BUILDING_PHOTO_PATH), { recursive: true });
		writeFileSync(BUILDING_PHOTO_PATH, JSON.stringify(photo, null, 2), 'utf-8');
		return;
	}
	await database
		.prepare('UPDATE screen_state SET building_photo_json = ?, updated_at = ? WHERE id = 1')
		.bind(JSON.stringify(photo), new Date().toISOString())
		.run();
}

export async function loadBackgroundMusic(database?: D1Database): Promise<BackgroundMusic> {
	if (!database) {
		return existsSync(BACKGROUND_MUSIC_PATH)
			? (JSON.parse(readFileSync(BACKGROUND_MUSIC_PATH, 'utf-8')) as BackgroundMusic)
			: DEFAULT_BACKGROUND_MUSIC;
	}
	const state = await database
		.prepare('SELECT music_json FROM screen_state WHERE id = 1')
		.first<{ music_json: string | null }>();
	return state?.music_json ? (JSON.parse(state.music_json) as BackgroundMusic) : DEFAULT_BACKGROUND_MUSIC;
}

export async function saveBackgroundMusic(music: BackgroundMusic, database?: D1Database): Promise<void> {
	if (!database) {
		mkdirSync(dirname(BACKGROUND_MUSIC_PATH), { recursive: true });
		writeFileSync(BACKGROUND_MUSIC_PATH, JSON.stringify(music, null, 2), 'utf-8');
		return;
	}
	await database
		.prepare('UPDATE screen_state SET music_json = ?, updated_at = ? WHERE id = 1')
		.bind(JSON.stringify(music), new Date().toISOString())
		.run();
}
