<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const navLinks = [
		{ href: '/client', label: 'Dashboard' },
		{ href: '/client/tickets', label: 'Tickets' }
	];
</script>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
			<div class="flex items-center gap-6">
				<span class="text-lg font-semibold text-gray-900">Resolvr</span>
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium {page.url.pathname === link.href
							? 'text-blue-600'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
			<div class="flex items-center gap-4">
				<span class="text-sm text-gray-600">{data.profile.name}</span>
				<form method="POST" action="/client/logout">
					<button type="submit" class="text-sm text-gray-500 hover:text-gray-700">Sign out</button>
				</form>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-5xl px-6 py-8">
		{@render children()}
	</main>
</div>
