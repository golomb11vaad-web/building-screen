import type { PageServerLoad } from './$types';
import { loadMessages } from '$lib/server/messageStore';
import { isEligible, sortForRotation } from '$lib/eligibility';
import { getWeather } from '$lib/server/weather';
import { getNews } from '$lib/server/news';
import { getHebrewDate } from '$lib/server/hebrew';
import { getFinanceData } from '$lib/server/finance';
import { WEATHER_LAT, WEATHER_LON, BUILDING_NAME, BUILDING_PHONES } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const now = new Date();
	const eligible = loadMessages().filter((message) => isEligible(message, now));
	const [weatherResult, newsResult, hebrewDateResult, financeResult] = await Promise.allSettled([
		getWeather(WEATHER_LAT, WEATHER_LON),
		getNews(),
		getHebrewDate(),
		getFinanceData(),
	]);
	const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
	const news = newsResult.status === 'fulfilled' ? newsResult.value : [];
	const hebrewDate = hebrewDateResult.status === 'fulfilled' ? hebrewDateResult.value : null;
	const finance = financeResult.status === 'fulfilled' ? financeResult.value : [];
	const buildingName = BUILDING_NAME || '';
	const buildingPhones = BUILDING_PHONES ? BUILDING_PHONES.split('\n').filter(Boolean) : [];
	return { rotation: sortForRotation(eligible), weather, news, hebrewDate, finance, buildingName, buildingPhones };
};
