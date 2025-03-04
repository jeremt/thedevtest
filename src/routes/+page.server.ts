import { developers, questions } from '$lib/db';

export const load = () => {
	return { questions, developers };
};
