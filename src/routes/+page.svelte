<script lang="ts">
	let { data } = $props();

	let screen = $state<'start' | 'questions' | 'end'>('start');
	let questionIndex = $state(0);
	let currentQuestion = $derived(data.questions[questionIndex]);

	type DeveloperScores = {
		[K in keyof typeof data.developers]: number;
	};
	let scores = $state<DeveloperScores>({ ancien: 0, hacker: 0, hipster: 0, inge: 0 });
	let yourDev = $derived(
		Object.entries(scores).toSorted((a, b) => b[1] - a[1])[0][0] as keyof typeof data.developers
	);
</script>

<p class="projectName">&gt; THE DEV TEST</p>

<main>
	{#if screen === 'questions' && currentQuestion}
		<h1 class="small">{currentQuestion.text}</h1>
		{#key questionIndex}
			{#each currentQuestion.choices as choice, i}
				<button
					class="choice"
					style:--delay="{i * 0.1}s"
					onclick={() => {
						for (const key of Object.keys(scores) as (keyof typeof data.developers)[]) {
							scores[key] += choice[key];
						}
						questionIndex += 1;
						if (questionIndex === data.questions.length) {
							screen = 'end';
						}
					}}
				>
					{choice.text}
				</button>
			{/each}
		{/key}
	{:else if screen === 'start'}
		<h1>Quel type de dev es-tu ?</h1>
		<p>
			Le meilleur test de personnalité pour les développeur⋅ses basé sur un algorithme innovant à la
			pointe de la technologie.
		</p>
		<button
			class="start"
			onclick={() => {
				questionIndex = 0;
				screen = 'questions';
			}}>Passer le test !</button
		>
	{:else if screen === 'end'}
		<img width="250" height="250" src="/{yourDev}.webp" alt="" />
		<h1 class="small">Tu es {data.developers[yourDev].title} !</h1>
		<p>{data.developers[yourDev].description}</p>
	{/if}
</main>

<style>
	p {
		font-family: var(--font-body);
		line-height: 1.5;
		text-align: center;
		margin: 0;
		@media (max-width: 25rem) {
			font-size: 0.9rem;
		}
	}
	p.projectName {
		position: absolute;
		top: 1rem;
		left: 1rem;
	}
	main {
		display: grid;
		margin: auto;
		place-items: center;
		padding: 2rem;
		gap: 1.5rem;
		max-width: 50rem;
		width: 100%;
	}
	h1 {
		font-family: var(--font-main);
		font-weight: 700;
		text-wrap: balance;
		text-align: center;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: -0.01rem;
		font-size: clamp(2rem, 7vw, 4.5rem);
		&.small {
			font-size: 2.2rem;
		}
	}

	button {
		color: white;
		border: 0.2rem solid white;
		background-color: transparent;
		padding: 0.4em 0.8em;
		cursor: pointer;
		transition: 0.3s all;
		opacity: 0;
		animation: appear 0.5s forwards;
		animation-delay: var(--delay, 0);
		&:hover {
			translate: -0.3rem -0.3rem;
			box-shadow: 0.3rem 0.3rem 0 white;
		}
		&:active {
			translate: 0 0;
			box-shadow: 0 0 0 white;
		}
		&.start {
			font-size: clamp(1.4rem, 4.5vw, 2.5rem);
			font-family: var(--font-main);
			text-transform: uppercase;
		}
		&.choice {
			font-family: var(--font-body);
			font-size: 1.2rem;
			@media (max-width: 25rem) {
				font-size: 0.9rem;
			}
		}
	}
	img {
		max-width: 100%;
		border-radius: 50%;
		margin-top: 2rem;
	}
	@keyframes appear {
		from {
			opacity: 0;
			scale: 0.9;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
</style>
