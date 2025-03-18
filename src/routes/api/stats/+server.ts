import { json } from '@sveltejs/kit';

export const GET = () => {
	return json({ message: 'GET request' });
};
