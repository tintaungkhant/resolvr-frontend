import { authenticatedApi } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('agent_token')!;
	const type = url.searchParams.get('type') ?? 'mine';

	const result = await authenticatedApi(`/api/v1/agent/tickets?type=${type}`, token);

	return { tickets: result.data ?? [], type };
};
