import { fail } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const token = cookies.get('agent_token')!;

	const [ticketResult, messagesResult] = await Promise.all([
		authenticatedApi(`/api/v1/agent/tickets/${params.id}`, token),
		authenticatedApi(`/api/v1/agent/tickets/${params.id}/messages`, token)
	]);

	return {
		ticket: ticketResult.data,
		messages: messagesResult.data ?? []
	};
};

export const actions = {
	message: async ({ request, cookies, params }) => {
		const token = cookies.get('agent_token')!;
		const formData = await request.formData();
		const content = formData.get('content') as string;
		const isInternal = formData.get('is_internal') === 'on';

		const result = await authenticatedApi(
			`/api/v1/agent/tickets/${params.id}/messages`,
			token,
			{
				method: 'POST',
				body: JSON.stringify({ content, is_internal: isInternal })
			}
		);

		if (!result.success) {
			return fail(422, { error: result.message ?? 'Failed to send message' });
		}
	}
} satisfies Actions;
