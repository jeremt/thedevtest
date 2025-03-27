<script lang="ts">
	import type { developers } from '$lib/db';
	import { setSwaggerContext } from '$lib/swagger/context.svelte';
	import '../app.css';
	let { children } = $props();

	const swagger = setSwaggerContext();
	type DeveloperStats = {
		[K in keyof typeof developers]: number;
	};
	let stats = $state<DeveloperStats>();
	const loadStats = async () => {
		const res = await swagger.client.GET('/api/stats/');
		if (!res.error) {
			stats = res.data;
		}
	};
	$effect(() => {
		loadStats();
	});
</script>

{@render children()}

{#if stats}
	<div class="stats">
		<div style:color="var(--color-ancien)">
			<img src="/ancien.webp" alt="" />
			<div>{stats.ancien} personnes</div>
		</div>
		<div style:color="var(--color-hacker)">
			<img src="/hacker.webp" alt="" />
			<div>{stats.hacker} personnes</div>
		</div>
		<div style:color="var(--color-hipster)">
			<img src="/hipster.webp" alt="" />
			<div>{stats.hipster} personnes</div>
		</div>
		<div style:color="var(--color-inge)">
			<img src="/inge.webp" alt="" />
			<div>{stats.inge} personnes</div>
		</div>
	</div>
{/if}

<style>
	.stats {
		display: grid;
		gap: 1rem;
		max-width: 40rem;
		margin-inline: auto;
		margin-bottom: 1rem;
		padding: 1rem;
		font-family: var(--font-main);
		font-size: 1.1rem;
		text-align: center;
		grid-template-columns: repeat(4, 1fr);
		@media (max-width: 30rem) {
			grid-template-columns: repeat(2, 1fr);
		}
		img {
			width: 100%;
		}
	}
</style>
