import { redirect } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('agent_token');

	if (!token) {
		redirect(303, '/agent/login');
	}

	const result = await authenticatedApi('/api/v1/agent/profile', token);

	if (!result.success) {
		cookies.delete('agent_token', { path: '/agent' });
		redirect(303, '/agent/login');
	}

	return { profile: result.data };
};
