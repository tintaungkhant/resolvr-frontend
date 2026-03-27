<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6">
	<h2 class="text-xl font-semibold text-gray-900">Welcome, {data.profile.name}</h2>
	<p class="mt-2 text-sm text-gray-500">You are logged in as a client.</p>
	<a href="/client/tickets" class="mt-4 inline-block text-sm text-blue-600 hover:underline">
		View your tickets &rarr;
	</a>
</div>
