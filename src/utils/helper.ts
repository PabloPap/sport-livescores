import { SECRET_API_KEY } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Match } from '../types/types';
import type { ApiData, ApiCategory, ApiOptions } from '../types/types';

export function getIdByProperty<T extends { id: number; [prop: string]: any }>(
	items: T[],
	name: string,
	prop: string
): number | undefined {
	const item = items.find((item) => item[prop] === name);
	return item ? item.id : undefined;
}

export async function getApiResponseWrapper(params: ApiData) {
	const { apiCategory, id, options } = params;
	const requestConfig: RequestInit = {
		headers: { 'X-Auth-Token': `${SECRET_API_KEY}` }
	};
	const response = await fetchData(apiCategory, id, options, requestConfig);
	if (!response.ok) {
		throw new Error(`Network error! Status: ${response.status}`);
	}
	return await response.json();
}

export async function getApiResponse(params: ApiData) {
	try {
		const dataRes = await getApiResponseWrapper(params);
		return dataRes;
	} catch (error) {
		console.error('Error:', error);
	}
}

export async function fetchData(
	apiCategory: ApiCategory,
	id?: number,
	options: ApiOptions = {},
	config: RequestInit = {}
) {
	let url = `${PUBLIC_BASE_URL}`;

	url += `${apiCategory.category1}/`;

	id ? (url += `${id}/`) : '';

	apiCategory.category2 ? (url += `${apiCategory.category2}/`) : '';

	for (const [key, value] of Object.entries(options)) {
		const pairs = `${key}=${value}`;
		url.includes('?') ? (url += `&${pairs}`) : (url += `?${pairs}`);
	}

	return await fetch(url, config);
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

export async function getGroupOfMatchesForArea() {
	const areasParams: ApiData = {
		apiCategory: { category1: 'areas' }
	};
	const areaData = await getApiResponse(areasParams);
	const areaId = getIdByProperty(areaData?.areas, 'Germany', 'name');

	if (areaId) {
		const competitionParams: ApiData = {
			apiCategory: { category1: 'competitions' },
			options: { areas: areaId }
		};
		const competitionData = await getApiResponse(competitionParams);
		const competitionId = getIdByProperty(competitionData?.competitions, 'Bundesliga', 'name');

		if (competitionId) {
			const matchesParams: ApiData = {
				apiCategory: { category1: 'competitions', category2: 'matches' },
				id: competitionId
			};
			const matchesData = await getApiResponse(matchesParams);

			const matches = matchesData?.matches;
			const currentMatchday = matches[0].season.currentMatchday;

			const matchesFromMatchdays = getMatchesByMatchdays(matches, currentMatchday);

			const groupOfMatchesByMatchday = getGroupOfMatchesByMatchdays(
				matchesFromMatchdays,
				currentMatchday
			);
			return { groupOfMatchesByMatchday };
		}
		throw new Error('could not retrive data for competition');
	}
	throw new Error('could not retrive data for area');
}
