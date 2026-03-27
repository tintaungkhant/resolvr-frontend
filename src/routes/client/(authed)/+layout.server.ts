import { redirect } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('client_token');

	if (!token) {
		redirect(303, '/client/login');
	}

	const result = await authenticatedApi('/api/v1/client/profile', token);

	if (!result.success) {
		cookies.delete('client_token', { path: '/client' });
		redirect(303, '/client/login');
	}

	return { profile: result.data };
};
