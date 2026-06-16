import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Message } from '../types';

const DATA_PATH = resolve('data/messages.json');
const SEED_PATH = resolve('data/messages.seed.json');

export function loadMessages(): Message[] {
	const path = existsSync(DATA_PATH) ? DATA_PATH : SEED_PATH;
	const raw = readFileSync(path, 'utf-8');
	return JSON.parse(raw) as Message[];
}

export function saveMessages(messages: Message[]): void {
	mkdirSync(dirname(DATA_PATH), { recursive: true });
	writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}
