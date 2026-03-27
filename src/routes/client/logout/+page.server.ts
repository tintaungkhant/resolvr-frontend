import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('client_token', { path: '/client' });
		redirect(303, '/client/login');
	}
} satisfies Actions;
