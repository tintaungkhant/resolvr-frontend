<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const priorityColors: Record<string, string> = {
		low: 'bg-gray-100 text-gray-700',
		medium: 'bg-blue-100 text-blue-700',
		high: 'bg-orange-100 text-orange-700',
		urgent: 'bg-red-100 text-red-700'
	};

	const statusColors: Record<string, string> = {
		open: 'bg-green-100 text-green-700',
		'on-hold': 'bg-yellow-100 text-yellow-700',
		resolved: 'bg-gray-100 text-gray-700',
		archived: 'bg-gray-100 text-gray-500'
	};
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold text-gray-900">Tickets</h1>
		<div class="flex rounded-md border border-gray-300 text-sm">
			<a
				href="/agent/tickets?type=mine"
				class="rounded-l-md px-3 py-1.5 {data.type === 'mine'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'text-gray-500 hover:bg-gray-50'}"
			>
				My Tickets
			</a>
			<a
				href="/agent/tickets?type=all"
				class="rounded-r-md border-l border-gray-300 px-3 py-1.5 {data.type === 'all'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'text-gray-500 hover:bg-gray-50'}"
			>
				All
			</a>
		</div>
	</div>

	{#if data.tickets.length === 0}
		<div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
			No tickets found.
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">ID</th>
						<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
						<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
							Priority
						</th>
						<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
						<th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
							Created
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.tickets as ticket}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3 text-sm text-gray-500">#{ticket.id}</td>
							<td class="px-4 py-3 text-sm">
								<a
									href="/agent/tickets/{ticket.id}"
									class="font-medium text-gray-900 hover:text-blue-600"
								>
									{ticket.title}
								</a>
							</td>
							<td class="px-4 py-3 text-sm">
								<span
									class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {priorityColors[
										ticket.priority
									] ?? ''}"
								>
									{ticket.priority}
								</span>
							</td>
							<td class="px-4 py-3 text-sm">
								<span
									class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
										ticket.status
									] ?? ''}"
								>
									{ticket.status}
								</span>
							</td>
							<td class="px-4 py-3 text-sm text-gray-500">
								{new Date(ticket.created_at).toLocaleDateString()}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
