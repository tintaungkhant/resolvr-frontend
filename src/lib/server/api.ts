import { API_URL } from '$env/static/private';

export async function api(path: string, options: RequestInit = {}) {
	const { headers, ...rest } = options;
	const res = await fetch(`${API_URL}${path}`, {
		...rest,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...headers
		}
	});

	return res.json();
}

export async function authenticatedApi(path: string, token: string, options: RequestInit = {}) {
	return api(path, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...options.headers
		}
	});
}
