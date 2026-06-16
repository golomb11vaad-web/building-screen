import type { PageServerLoad } from './$types';
import { loadMessages } from '$lib/server/messageStore';
import { isEligible, sortForRotation } from '$lib/eligibility';

export const load: PageServerLoad = () => {
	const now = new Date();
	const eligible = loadMessages().filter((message) => isEligible(message, now));

	return { rotation: sortForRotation(eligible) };
};
