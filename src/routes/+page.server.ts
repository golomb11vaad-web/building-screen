import type { PageServerLoad } from './$types';
import { loadMessages } from '$lib/server/messageStore';
import { isEligible, sortForRotation } from '$lib/eligibility';
import { getWeather } from '$lib/server/weather';
import { getNews } from '$lib/server/news';
import { WEATHER_LAT, WEATHER_LON } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const now = new Date();
	const eligible = loadMessages().filter((message) => isEligible(message, now));
	const [weather, news] = await Promise.all([
		getWeather(WEATHER_LAT, WEATHER_LON),
		getNews(),
	]);
	return { rotation: sortForRotation(eligible), weather, news };
};
