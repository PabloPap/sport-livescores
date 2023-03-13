import type { PageServerLoad } from './$types';
import { getGroupOfMatchesForArea } from '$utils/helper';

export const load = (async () => {
	return await getGroupOfMatchesForArea();
}) satisfies PageServerLoad;
