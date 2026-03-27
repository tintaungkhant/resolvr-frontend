<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
			<h1 class="text-lg font-semibold text-gray-900">Client Dashboard</h1>
			<form method="POST" action="/client/logout">
				<button
					type="submit"
					class="text-sm text-gray-500 hover:text-gray-700"
				>
					Sign out
				</button>
			</form>
		</div>
	</nav>

	<main class="mx-auto max-w-4xl px-6 py-8">
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<h2 class="text-xl font-semibold text-gray-900">
				Welcome, {data.profile.name}
			</h2>
			<p class="mt-2 text-gray-600">You are logged in as a client.</p>
		</div>
	</main>
</div>
