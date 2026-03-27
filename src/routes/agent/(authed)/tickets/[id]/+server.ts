import { json } from '@sveltejs/kit';
import { authenticatedApi } from '$lib/server/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, params, url }) => {
	const token = cookies.get('agent_token')!;
	const page = url.searchParams.get('page') ?? '1';

	const result = await authenticatedApi(
		`/api/v1/agent/tickets/${params.id}/messages?page=${page}`,
		token
	);

	return json({ messages: result.data ?? [], meta: result.meta ?? null });
};
