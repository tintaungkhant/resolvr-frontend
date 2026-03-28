import { authenticatedApi } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('client_token')!;
	const params = new URLSearchParams();

	const filterKeys = [
		'type',
		'search',
		'priority',
		'status',
		'sla_status',
		'started_from',
		'started_to',
		'due_from',
		'due_to'
	];

	const filters: Record<string, string> = {};
	for (const key of filterKeys) {
		const val = url.searchParams.get(key);
		if (val) {
			params.set(key, val);
			filters[key] = val;
		}
	}

	if (!params.has('type')) {
		params.set('type', 'mine');
		filters.type = 'mine';
	}

	const result = await authenticatedApi(`/api/v1/client/tickets?${params}`, token);

	return {
		tickets: result.data ?? [],
		filters
	};
};
