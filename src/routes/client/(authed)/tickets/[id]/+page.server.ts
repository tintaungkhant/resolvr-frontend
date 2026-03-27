import { fail } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const token = cookies.get('client_token')!;

	const [ticketResult, messagesResult] = await Promise.all([
		authenticatedApi(`/api/v1/client/tickets/${params.id}`, token),
		authenticatedApi(`/api/v1/client/tickets/${params.id}/messages`, token)
	]);

	return {
		ticket: ticketResult.data,
		messages: messagesResult.data ?? [],
		messagesMeta: messagesResult.meta ?? null
	};
};

export const actions = {
	message: async ({ request, cookies, params }) => {
		const token = cookies.get('client_token')!;
		const formData = await request.formData();
		const content = formData.get('content') as string;

		const result = await authenticatedApi(
			`/api/v1/client/tickets/${params.id}/messages`,
			token,
			{
				method: 'POST',
				body: JSON.stringify({ content })
			}
		);

		if (!result.success) {
			return fail(422, { error: result.message ?? 'Failed to send message' });
		}
	},

	priority: async ({ request, cookies, params }) => {
		const token = cookies.get('client_token')!;
		const formData = await request.formData();
		const priority = formData.get('priority') as string;

		const result = await authenticatedApi(
			`/api/v1/client/tickets/${params.id}/priority`,
			token,
			{
				method: 'PATCH',
				body: JSON.stringify({ priority })
			}
		);

		if (!result.success) {
			return fail(422, { error: result.message ?? 'Failed to update priority' });
		}
	},

	status: async ({ request, cookies, params }) => {
		const token = cookies.get('client_token')!;
		const formData = await request.formData();
		const status = formData.get('status') as string;

		const result = await authenticatedApi(
			`/api/v1/client/tickets/${params.id}/status`,
			token,
			{
				method: 'PATCH',
				body: JSON.stringify({ status })
			}
		);

		if (!result.success) {
			return fail(422, { error: result.message ?? 'Failed to update status' });
		}
	}
} satisfies Actions;
