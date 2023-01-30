import { SECRET_API_KEY } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Match } from '../types/types';
import type { ApiResponse, ApiData, ApiCategory, ApiOptions } from '../types/types';

export function getIdByProperty<T extends { id: number; [prop: string]: any }>(
	items: T[],
	name: string,
	prop: string
): number | undefined {
	const item = items.find((item) => item[prop] === name);
	return item ? item.id : undefined;
}

export async function getApiResponse(params: ApiData) {
	const { apiCategory, id, options } = params;
	const data = await fetchData(apiCategory, id, options);
	const dataRes: ApiResponse = await data.json();
	return dataRes;
}

export async function fetchData(apiCategory: ApiCategory, id?: number, options: ApiOptions = {}) {
	let url = `${PUBLIC_BASE_URL}`;

	url += `${apiCategory.category1}/`;

	id ? (url += `${id}/`) : '';

	apiCategory.category2 ? (url += `${apiCategory.category2}/`) : '';

	for (const [key, value] of Object.entries(options)) {
		const pairs = `${key}=${value}`;
		url.includes('?') ? (url += `&${pairs}`) : (url += `?${pairs}`);
	}

	return await fetch(url, {
		headers: {
			'X-Auth-Token': `${SECRET_API_KEY}`
		}
	});
}

export function matchdaysToFilter(currentMatchday: number, matchdaysAhead: number): number[] {
	const matchdays = [currentMatchday];
	for (let i = 1; i <= matchdaysAhead; i++) {
		matchdays.push(currentMatchday - i);
	}
	return matchdays;
}
// matchdaysToFilter: pass a number to show previous matchdays along with current
// TODO: make this selection to be made from the user
export function getMatchesByMatchdays(matches: Match[], currentMatchday: number): Match[] {
	const matchdaysToCheck = matchdaysToFilter(currentMatchday, 2);
	return matches.filter((match) => matchdaysToCheck.includes(match.matchday));
}

export function getMatchesInMatchday(matches: Match[], matchday: number): Match[] {
	return matches.filter((match: Match) => match.matchday === matchday);
}

export function getSortedMatchesFromMatchdays(matchesFromMatchdays: Match[]) {
	matchesFromMatchdays.slice().sort((a: Match, b: Match) => {
		return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
	});
}

export function getGroupOfMatchesByMatchdays(
	matchesFromMatchdays: Match[],
	currentMatchday: number
) {
	return Array.from({ length: currentMatchday + 1 }, (_, i) =>
		matchesFromMatchdays.filter((match) => match.matchday === i)
	);
}
