import type { Message, Weekday } from './types';

const TIME_ZONE = 'Asia/Jerusalem';

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	weekday: 'long'
});

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: TIME_ZONE
});

function weekdayFor(date: Date): Weekday {
	return weekdayFormatter.format(date).toLowerCase() as Weekday;
}

function dateOnlyFor(date: Date): string {
	return dateFormatter.format(date);
}

export function isEligible(message: Message, now: Date): boolean {
	if (message.enabled === false) return false;
	if (message.expiresAt && new Date(message.expiresAt).getTime() <= now.getTime()) {
		return false;
	}

	if (message.activeDays && message.activeDays.length > 0) {
		if (!message.activeDays.includes(weekdayFor(now))) {
			return false;
		}
	}

	const today = dateOnlyFor(now);

	if (message.activeFrom && today < message.activeFrom) {
		return false;
	}

	if (message.activeUntil && today > message.activeUntil) {
		return false;
	}

	return true;
}

export function sortForRotation(messages: Message[]): Message[] {
	const ordered = [...messages].sort(
		(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	);

	const pinned = ordered.filter((m) => m.pinned);
	const unpinned = ordered.filter((m) => !m.pinned);

	return [...pinned, ...pinned, ...unpinned];
}
