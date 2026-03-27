import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('agent_token', { path: '/agent' });
		redirect(303, '/agent/login');
	}
} satisfies Actions;
