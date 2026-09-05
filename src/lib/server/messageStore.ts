import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Message } from '../types';
import { normalizeLegacyRichText } from './adminActions';
import seedMessages from '../../../data/messages.seed.json';

const DATA_PATH = resolve('data/messages.json');
const SEED_PATH = resolve('data/messages.seed.json');

function normalizeMessages(messages: Message[]): Message[] {
	return messages.map((message) => ({ ...message, text: normalizeLegacyRichText(message.text) }));
}

export function loadMessages(): Message[] {
	const path = existsSync(DATA_PATH) && process.env.NODE_ENV !== 'test' ? DATA_PATH : SEED_PATH;
	const raw = readFileSync(path, 'utf-8');
	return normalizeMessages(JSON.parse(raw) as Message[]);
}

export function saveMessages(messages: Message[]): void {
	mkdirSync(dirname(DATA_PATH), { recursive: true });
	writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}

/**
 * The local file is intentionally retained as a no-account development fallback.
 * On Cloudflare, one D1 row is the shared source of truth for every screen.
 */
export async function loadSharedMessages(database?: D1Database): Promise<Message[]> {
	if (!database) return loadMessages();

	const state = await database
		.prepare('SELECT messages_json FROM screen_state WHERE id = 1')
		.first<{ messages_json: string }>();
	if (state) return normalizeMessages(JSON.parse(state.messages_json) as Message[]);

	// Imports as a build asset, so a new Worker can initialise D1 without a filesystem.
	const seed = seedMessages as Message[];
	await database
		.prepare(
			'INSERT INTO screen_state (id, messages_json, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO NOTHING'
		)
		.bind(JSON.stringify(seed), new Date().toISOString())
		.run();

	const initialized = await database
		.prepare('SELECT messages_json FROM screen_state WHERE id = 1')
		.first<{ messages_json: string }>();
	return initialized ? normalizeMessages(JSON.parse(initialized.messages_json) as Message[]) : seed;
}

export async function saveSharedMessages(messages: Message[], database?: D1Database): Promise<void> {
	if (!database) {
		saveMessages(messages);
		return;
	}

	await database
		.prepare(
			'INSERT INTO screen_state (id, messages_json, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET messages_json = excluded.messages_json, updated_at = excluded.updated_at'
		)
		.bind(JSON.stringify(messages), new Date().toISOString())
		.run();
}
