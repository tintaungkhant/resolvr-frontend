import { fail } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const token = cookies.get('agent_token')!;

	const [ticketResult, messagesResult, agentsResult] = await Promise.all([
		authenticatedApi(`/api/v1/agent/tickets/${params.id}`, token),
		authenticatedApi(`/api/v1/agent/tickets/${params.id}/messages`, token),
		authenticatedApi('/api/v1/agent/agents', token)
	]);

	return {
		ticket: ticketResult.data,
		messages: messagesResult.data ?? [],
		messagesMeta: messagesResult.meta ?? null,
		agents: agentsResult.data ?? []
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
	},

	priority: async ({ request, cookies, params }) => {
		const token = cookies.get('agent_token')!;
		const formData = await request.formData();
		const priority = formData.get('priority') as string;

		const result = await authenticatedApi(
			`/api/v1/agent/tickets/${params.id}/priority`,
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

	assignee: async ({ request, cookies, params }) => {
		const token = cookies.get('agent_token')!;
		const formData = await request.formData();
		const assignee_id = formData.get('assignee_id') as string;

		const result = await authenticatedApi(
			`/api/v1/agent/tickets/${params.id}/assignee`,
			token,
			{
				method: 'PATCH',
				body: JSON.stringify({ assignee_id: Number(assignee_id) })
			}
		);

		if (!result.success) {
			return fail(422, { error: result.message ?? 'Failed to update assignee' });
		}
	},

	status: async ({ request, cookies, params }) => {
		const token = cookies.get('agent_token')!;
		const formData = await request.formData();
		const status = formData.get('status') as string;

		const result = await authenticatedApi(
			`/api/v1/agent/tickets/${params.id}/status`,
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
