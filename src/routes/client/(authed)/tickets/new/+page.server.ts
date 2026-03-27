import { fail, redirect } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('client_token')!;
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const priority = formData.get('priority') as string;

		const result = await authenticatedApi('/api/v1/client/tickets', token, {
			method: 'POST',
			body: JSON.stringify({ title, description, priority })
		});

		if (!result.success) {
			return fail(422, {
				title,
				description,
				priority,
				error: result.message ?? 'Failed to create ticket',
				errors: result.errors ?? {}
			});
		}

		redirect(303, `/client/tickets/${result.data.id}`);
	}
} satisfies Actions;
