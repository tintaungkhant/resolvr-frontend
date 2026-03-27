import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const result = await api('/api/v1/client/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		if (!result.success) {
			return fail(401, { email, error: result.message ?? 'Invalid credentials' });
		}

		cookies.set('client_token', result.data.token, {
			path: '/client',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/client');
	}
} satisfies Actions;
