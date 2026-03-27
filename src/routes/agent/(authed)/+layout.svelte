<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const navLinks = [
		{ href: '/agent', label: 'Dashboard' },
		{ href: '/agent/tickets', label: 'Tickets' }
	];

	function isActive(href: string): boolean {
		if (href === '/agent') return page.url.pathname === '/agent';
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<div class="flex items-center gap-6">
				<a href="/agent" class="text-lg font-semibold text-gray-900 no-underline">Resolvr</a>
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm no-underline {isActive(link.href)
							? 'font-medium text-blue-600'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
			<div class="flex items-center gap-4">
				<span class="text-sm text-gray-600">{data.profile.name}</span>
				<form method="POST" action="/agent/logout">
					<button type="submit" class="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
						Sign out
					</button>
				</form>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-5xl px-4 py-6">
		{@render children()}
	</main>
</div>
