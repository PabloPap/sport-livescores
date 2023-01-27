<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>matches</h1>
<ul>
	{#each data.matchesFromMatchdays as match}
		<li>
			{`${match.homeTeam.name} - ${match.awayTeam.name}`}
			{`${match.score.fullTime.home} - ${match.score.fullTime.away}`}
		</li>
	{/each}
</ul>
