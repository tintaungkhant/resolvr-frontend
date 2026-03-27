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

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-xl font-semibold text-gray-900">Tickets</h1>
	<div class="flex items-center gap-3">
		<div class="flex overflow-hidden rounded-md border border-gray-200 text-sm">
			<a
				href="/client/tickets?type=mine"
				class="px-3 py-1.5 no-underline {data.type === 'mine'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'bg-white text-gray-500 hover:bg-gray-50'}"
			>
				My Tickets
			</a>
			<a
				href="/client/tickets?type=all"
				class="border-l border-gray-200 px-3 py-1.5 no-underline {data.type === 'all'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'bg-white text-gray-500 hover:bg-gray-50'}"
			>
				All
			</a>
		</div>
		<a
			href="/client/tickets/new"
			class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white no-underline hover:bg-blue-700"
		>
			New Ticket
		</a>
	</div>
</div>

{#if data.tickets.length === 0}
	<div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
		No tickets found.
	</div>
{:else}
	<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
				<tr>
					<th class="px-4 py-3 font-medium">ID</th>
					<th class="px-4 py-3 font-medium">Title</th>
					<th class="px-4 py-3 font-medium">Priority</th>
					<th class="px-4 py-3 font-medium">Status</th>
					<th class="px-4 py-3 font-medium">Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.tickets as ticket, i}
					<tr class="{i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50">
						<td class="px-4 py-3 text-gray-400">#{ticket.id}</td>
						<td class="px-4 py-3">
							<a
								href="/client/tickets/{ticket.id}"
								class="font-medium text-gray-900 no-underline hover:text-blue-600"
							>
								{ticket.title}
							</a>
						</td>
						<td class="px-4 py-3">
							<span
								class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {priorityColors[
									ticket.priority
								] ?? ''}"
							>
								{ticket.priority}
							</span>
						</td>
						<td class="px-4 py-3">
							<span
								class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
									ticket.status
								] ?? ''}"
							>
								{ticket.status}
							</span>
						</td>
						<td class="px-4 py-3 text-gray-400">
							{new Date(ticket.created_at).toLocaleDateString()}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
