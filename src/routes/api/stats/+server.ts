import { json } from '@sveltejs/kit';

export const GET = () => {
	return json({
		ancien: Math.floor(Math.random() * 1000),
		inge: Math.floor(Math.random() * 1000),
		hipster: Math.floor(Math.random() * 1000),
		hacker: Math.floor(Math.random() * 1000)
	});
};
