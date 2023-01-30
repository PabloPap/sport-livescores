<script lang="ts">
	import type { PageData } from './$types';
	import type { Match } from '../types/types';

	export let data: PageData;

	let matchDates = (match: Match) => {
		let [date] = match.utcDate.split('T');
		let matchDate = new Date(date).toLocaleDateString();
		let matchTime = new Date(match.utcDate);
		const hour = matchTime.getUTCHours();
		const minute = matchTime.getUTCMinutes();
		return { date: matchDate, time: `${hour}:${minute}` };
	};
</script>

<div>
	<ul>
		{#each data.groupOfMatchesByMatchday as match}
			{#each match as matchDate, i}
				<li>
					{@html matchDates(matchDate).date}
					{@html matchDates(matchDate).time}
					{`${matchDate.homeTeam.name} - ${matchDate.awayTeam.name}`}
					{`${matchDate.score.fullTime.home} - ${matchDate.score.fullTime.away}`}
				</li>
				{#if i === match.length - 1}
					-----------
				{/if}
			{/each}
		{/each}
	</ul>
</div>
