export interface Area {
	id: number;
	name: string;
	countryCode: string;
	flag: null;
	parentAreaId: number;
	parentArea: string;
}

export interface Competition {
	id: number;
	area: object;
	name: string;
	code: string;
	type: string;
	emblem: string;
	plan: string;
	currentSeason: object;
	numberOfAvailableSeasons: number;
	lastUpdated: string;
}

export interface Match {
	area: {
		id: number;
		name: string;
		code: string;
		flag: string;
	};
	competition: {
		id: number;
		name: string;
		code: string;
		type: string;
		emblem: string;
	};
	season: {
		id: number;
		startDate: string;
		endDate: string;
		currentMatchday: number;
		winner: null;
	};
	id: number;
	utcDate: string;
	status: string;
	matchday: number;
	stage: string;
	group: null;
	lastUpdated: string;
	homeTeam: {
		id: number;
		name: string;
		shortName: string;
		tla: string;
		crest: string;
	};
	awayTeam: {
		id: number;
		name: string;
		shortName: string;
		tla: string;
		crest: string;
	};
	score: {
		winner: string;
		duration: string;
		fullTime: {
			home: number;
			away: number;
		};
		halfTime: {
			home: number;
			away: number;
		};
	};
	odds: {
		msg: string;
	};
}

export type ApiOptions = {
	status?: string;
	limit?: number;
	areas?: number;
};

export type ApiCategory = {
	category1?: string;
	category2?: string;
};

export interface ApiData {
	apiCategory: ApiCategory;
	id?: number;
	options?: ApiOptions;
}
