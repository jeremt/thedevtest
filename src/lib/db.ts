export const developers = {
	hacker: {
		title: 'Hacker⋅euse',
		description:
			"Iel respire Neovim, iel vit Arch Linux (compilé à partir des sources, évidemment), et son hoodie noir est sa carapace. Si vous le voyez sourire, c'est qu'iel a trouvé une faille critique dans votre système, ou qu'iel a enfin réussi à configurer son .vimrc. Son animal de compagnie est un canard en caoutchouc qui l'aide à débugger, et iel considère la sécurité informatique comme un défi personnel, où chaque système est une énigme à résoudre."
	},
	hipster: {
		title: 'Hispter',
		description:
			"Son Mac est toujours à jour, avec la dernière version de Cursor et Arc, et iel passe son temps à regarder des vidéos de présentation de nouvelles technologies, en se disant : 'Ça, ça va révolutionner le monde !' Sa devise : 'Pourquoi faire simple quand on peut faire compliqué et tendance ?' Iel est abonné·e à toutes les newsletters tech, son bureau est un champ de bataille de gadgets high-tech, et iel change de framework tous les six mois, juste pour le plaisir. Si une technologie n'a pas de logo flashy, elle ne l'intéresse pas."
	},
	ancien: {
		title: "L'Ancien⋅ne",
		description:
			"Iel a commencé à coder avant que l'Internet ne soit cool, iel a des cicatrices de guerre de l'époque des cartes perforées, et iel considère que Java est une technologie récente et prometteuse. Son code est comme un vin millésimé : il s'améliore avec l'âge. Iel a connu l'époque où les bugs se corrigeaient avec du scotch et du chewing-gum, iel a une collection de livres de programmation qui pèsent plus lourd que son ordinateur, et iel a un avis sur tout, et iel a toujours raison."
	},
	inge: {
		title: "L'Ingé",
		description:
			"Python est son outil de prédilection, les mathématiques sont son terrain de jeu, et iel résout des problèmes complexes avec des équations et des algorithmes. Iel considère que le code est une forme d'art, et les mathématiques sont sa muse. Iel a un doctorat en informatique, mais iel préfère passer son temps à coder des simulations de l'univers. Iel a une collection de tableaux blancs remplis d'équations incompréhensibles, et iel rêve de créer une intelligence artificielle qui pourra enfin comprendre ses blagues de mathématicien·ne."
	}
};

export const questions = [
	{
		text: 'Votre éditeur de code préféré est...',
		choices: [
			{ text: 'Neovim ou rien !', hacker: 1, ancien: 0.8, hipster: 0.5, inge: 0.2 },
			{
				text: 'Visual Studio Code comme tout le monde',
				hacker: 0.2,
				ancien: 0.4,
				hipster: 0.5,
				inge: 0.2
			},
			{
				text: "Cursor, mais je reste à l'affût des nouveautés",
				hacker: 0.2,
				ancien: 0.4,
				hipster: 0.8,
				inge: 0.6
			},
			{ text: 'Eclipse évidemment !', hacker: 0.2, ancien: 1, hipster: 0.2, inge: 0.5 },
			{ text: 'PyCharm', hacker: 0.2, ancien: 0.2, hipster: 0.6, inge: 0.8 }
		]
	},
	{
		text: 'Quand un nouveau framework sort, vous...',
		choices: [
			{
				text: 'Foncez et créez un projet immédiatement',
				hacker: 0.3,
				ancien: 0.1,
				hipster: 1,
				inge: 0.2
			},
			{
				text: 'Restez sceptique et fidèle à vos technologies',
				hacker: 0.2,
				ancien: 1,
				hipster: 0.2,
				inge: 0.5
			},
			{
				text: "L'analysez en profondeur pour ses failles de sécurité",
				hacker: 1,
				ancien: 0.2,
				hipster: 0.5,
				inge: 0.3
			},
			{
				text: 'Êtes indifférent⋅e',
				hacker: 0.2,
				ancien: 0.8,
				hipster: 0.4,
				inge: 1
			}
		]
	},
	{
		text: "Votre système d'exploitation préféré...",
		choices: [
			{
				text: 'La dernière version de MacOS, sans hésitation !',
				hacker: 0.3,
				ancien: 0.2,
				hipster: 1,
				inge: 0.4
			},
			{
				text: 'Arch Linux, btw (compilé manuellement)',
				hacker: 1,
				ancien: 0.8,
				hipster: 0.6,
				inge: 0.2
			},
			{
				text: 'Une feuille et un crayon, il y a que ça de vrai ;)',
				hacker: 0.2,
				ancien: 0.3,
				hipster: 0.4,
				inge: 1
			}
		]
	},
	{
		text: 'Face à un bug complexe, votre première réaction...',
		choices: [
			{
				text: 'Modéliser mathématiquement le problème',
				hacker: 0.2,
				ancien: 0.3,
				hipster: 0.4,
				inge: 1
			},
			{
				text: 'Le résoudre comme au bon vieux temps, au débuggeur et jus de cerveau !',
				hacker: 0.3,
				ancien: 1,
				hipster: 0.2,
				inge: 0.4
			},
			{
				text: 'ChatGPT, Claude, Deepseek, etc. On demande son avis au LLM du moment 😁',
				hacker: 0.2,
				ancien: 0.2,
				hipster: 1,
				inge: 0.3
			},
			{
				text: 'Chercher une potentielle exploitation 🤫',
				hacker: 1,
				ancien: 0.3,
				hipster: 0.4,
				inge: 0.2
			}
		]
	},
	{
		text: 'Votre style de documentation préféré...',
		choices: [
			{
				text: 'Docu quoi ?',
				hacker: 0.7,
				ancien: 0.2,
				hipster: 0.7,
				inge: 0.2
			},
			{
				text: "Des commentaires détaillés à l'ancienne",
				hacker: 0.3,
				ancien: 1,
				hipster: 0.2,
				inge: 0.5
			},
			{
				text: 'Des documents LaTeX mathématiques',
				hacker: 0.2,
				ancien: 0.3,
				hipster: 0.4,
				inge: 1
			},
			{
				text: 'Une documentation Notion ultra stylée',
				hacker: 0.2,
				ancien: 0.2,
				hipster: 1,
				inge: 0.3
			}
		]
	},
	{
		text: "Un alien débarque et vous demande d'expliquer votre métier. Vous répondez...",
		choices: [
			{
				text: "Un long récit commençant par 'À mon époque...'",
				hacker: 0.2,
				ancien: 1,
				hipster: 0.2,
				inge: 0.3
			},
			{
				text: 'Une présentation Keynote avec des animations futuristes',
				hacker: 0.2,
				ancien: 0.1,
				hipster: 1,
				inge: 0.4
			},
			{
				text: 'Un modèle mathématique de communication interstellaire',
				hacker: 0.3,
				ancien: 0.2,
				hipster: 0.4,
				inge: 1
			},
			{
				text: 'Une démo en direct de hacking live sur son vaisseau',
				hacker: 1,
				ancien: 0.3,
				hipster: 0.5,
				inge: 0.2
			}
		]
	},
	{
		text: 'Votre side project ultime serait...',
		choices: [
			{
				text: 'Une IA qui résout des problèmes mathématiques complexes',
				hacker: 0.2,
				ancien: 0.3,
				hipster: 0.4,
				inge: 1
			},
			{
				text: 'Une app qui prédit les prochaines tendances tech',
				hacker: 0.3,
				ancien: 0.2,
				hipster: 1,
				inge: 0.5
			},
			{
				text: 'Un framework de cybersécurité open-source',
				hacker: 1,
				ancien: 0.4,
				hipster: 0.6,
				inge: 0.3
			},

			{
				text: 'Un système de gestion de projet rétro-compatible',
				hacker: 0.2,
				ancien: 1,
				hipster: 0.3,
				inge: 0.4
			}
		]
	},
	{
		text: 'La musique que vous codez ressemblerait à...',
		choices: [
			{
				text: 'Un podcast tech avec des jingles électroniques',
				hacker: 0.2,
				ancien: 0.2,
				hipster: 1,
				inge: 0.4
			},
			{
				text: 'Un orchestre symphonique de compilateurs vintage',
				hacker: 0.3,
				ancien: 1,
				hipster: 0.2,
				inge: 0.5
			},
			{
				text: 'Une composition algorithmique générée par Python',
				hacker: 0.2,
				ancien: 0.4,
				hipster: 0.3,
				inge: 1
			}
		]
	},
	{
		text: 'On vous propose de rejoindre une équipe. Votre premier réflexe...',
		choices: [
			{
				text: 'Comparer avec vos expériences passées',
				hacker: 0.3,
				ancien: 1,
				hipster: 0.3,
				inge: 0.4
			},
			{
				text: 'Analyser les vulnérabilités de leur infrastructure',
				hacker: 1,
				ancien: 0.4,
				hipster: 0.5,
				inge: 0.3
			},
			{
				text: 'Évaluer la complexité algorithmique de leurs projets',
				hacker: 0.2,
				ancien: 0.3,
				hipster: 0.4,
				inge: 1
			},
			{
				text: 'Vérifier si le stack technique est suffisamment cool',
				hacker: 0.2,
				ancien: 0.2,
				hipster: 1,
				inge: 0.4
			}
		]
	},
	{
		text: 'Votre définition du bonheur ultime en tant que développeur...',
		choices: [
			{
				text: 'Être cité dans un article Tech Crunch',
				hacker: 0.2,
				ancien: 0.2,
				hipster: 1,
				inge: 0.4
			},
			{
				text: 'Trouver et corriger une faille de sécu mondiale',
				hacker: 1,
				ancien: 0.3,
				hipster: 0.5,
				inge: 0.2
			},
			{
				text: 'Résoudre un problème mathématique séculaire',
				hacker: 0.2,
				ancien: 0.4,
				hipster: 0.3,
				inge: 1
			},
			{
				text: 'Un environnement de dev stable depuis 20 ans',
				hacker: 0.3,
				ancien: 1,
				hipster: 0.2,
				inge: 0.4
			}
		]
	}
];
