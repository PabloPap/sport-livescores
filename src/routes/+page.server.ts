import type { PageServerLoad } from './$types';
import type { ApiData } from '../types/types';
import {
	getMatchesByMatchdays,
	getApiResponse,
	getIdByProperty,
	getGroupOfMatchesByMatchdays
} from '$utils/helper';

export const load = (async () => {
	const areasParams: ApiData = {
		apiCategory: { category1: 'areas' }
	};
	const areaData = await getApiResponse(areasParams);
	const areaId = getIdByProperty(areaData.areas, 'Germany', 'name');

	const competitionParams: ApiData = {
		apiCategory: { category1: 'competitions' },
		options: { areas: areaId }
	};
	const competitionData = await getApiResponse(competitionParams);
	const competitionId = getIdByProperty(competitionData.competitions, 'Bundesliga', 'name');

	const matchesParams: ApiData = {
		apiCategory: { category1: 'competitions', category2: 'matches' },
		id: competitionId
	};
	const matchesData = await getApiResponse(matchesParams);

	const matches = matchesData.matches;
	const currentMatchday = matches[0].season.currentMatchday;

	const matchesFromMatchdays = getMatchesByMatchdays(matches, currentMatchday);

	const groupOfMatchesByMatchday = getGroupOfMatchesByMatchdays(
		matchesFromMatchdays,
		currentMatchday
	);

	return { groupOfMatchesByMatchday };
}) satisfies PageServerLoad;
