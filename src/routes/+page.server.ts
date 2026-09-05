import type { PageServerLoad } from './$types';
import { loadSharedMessages } from '$lib/server/messageStore';
import { loadAmbientBackgrounds, loadBackgroundMusic, loadBuildingPhoto } from '$lib/server/ambientStore';
import { isEligible, sortForRotation } from '$lib/eligibility';
import { getWeather } from '$lib/server/weather';
import { getNews } from '$lib/server/news';
import { getHebrewDate } from '$lib/server/hebrew';
import { getFinanceData } from '$lib/server/finance';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ platform }) => {
	const now = new Date();
	const runtime = dev ? env : (platform?.env ?? env);
	const database = dev ? undefined : platform?.env.DB;
	const [messages, backgrounds, buildingPhoto, backgroundMusic] = await Promise.all([
		loadSharedMessages(database),
		loadAmbientBackgrounds(database),
		loadBuildingPhoto(database),
		loadBackgroundMusic(database)
	]);
	const eligible = messages.filter((message) => isEligible(message, now));
	const [weatherResult, newsResult, hebrewDateResult, financeResult] = await Promise.allSettled([
		getWeather(runtime.WEATHER_LAT || '32.0853', runtime.WEATHER_LON || '34.7818'),
		getNews(),
		getHebrewDate(),
		getFinanceData(),
	]);
	const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
	const news = newsResult.status === 'fulfilled' ? newsResult.value : [];
	const hebrewDate = hebrewDateResult.status === 'fulfilled' ? hebrewDateResult.value : null;
	const finance = financeResult.status === 'fulfilled' ? financeResult.value : [];
	const buildingName = runtime.BUILDING_NAME || '';
	const buildingPhones = runtime.BUILDING_PHONES
		? runtime.BUILDING_PHONES.split(/\r?\n|\\n/).filter(Boolean)
		: [];
	const marketNews = news.filter((item) => item.source === 'Globes').slice(0, 3);
	const generalNews = news.filter((item) => item.source !== 'Globes');
	return {
		rotation: sortForRotation(eligible), weather, news: generalNews.length ? generalNews : news,
		marketNews, backgrounds, buildingPhoto, backgroundMusic, hebrewDate, finance, buildingName, buildingPhones
	};
};
