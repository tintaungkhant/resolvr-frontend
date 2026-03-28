<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let showFilters = $state(hasActiveFilters());

	function hasActiveFilters(): boolean {
		const ignore = new Set(['type']);
		for (const [key, val] of new URL(page.url).searchParams) {
			if (!ignore.has(key) && val) return true;
		}
		return false;
	}

	function applyFilters(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const params = new URLSearchParams();
		for (const [key, val] of formData) {
			if (val) params.set(key, val as string);
		}
		goto(`/agent/tickets?${params}`);
	}

	function clearFilters() {
		goto(`/agent/tickets?type=${data.filters.type ?? 'mine'}`);
	}

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
				href="/agent/tickets?type=mine"
				class="px-3 py-1.5 no-underline {data.filters.type === 'mine'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'bg-white text-gray-500 hover:bg-gray-50'}"
			>
				My Tickets
			</a>
			<a
				href="/agent/tickets?type=all"
				class="border-l border-gray-200 px-3 py-1.5 no-underline {data.filters.type === 'all'
					? 'bg-gray-100 font-medium text-gray-900'
					: 'bg-white text-gray-500 hover:bg-gray-50'}"
			>
				All
			</a>
		</div>
		<button
			onclick={() => (showFilters = !showFilters)}
			class="cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
		>
			{showFilters ? 'Hide Filters' : 'Filters'}
		</button>
	</div>
</div>

{#if showFilters}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			applyFilters(e);
		}}
		class="mb-4 rounded-lg border border-gray-200 bg-white p-4"
	>
		<input type="hidden" name="type" value={data.filters.type ?? 'mine'} />

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			<div>
				<label for="search" class="mb-1 block text-xs text-gray-500">Search</label>
				<input
					id="search"
					name="search"
					type="text"
					placeholder="Keyword..."
					value={data.filters.search ?? ''}
				/>
			</div>
			<div>
				<label for="organization_id" class="mb-1 block text-xs text-gray-500">
					Organization
				</label>
				<select id="organization_id" name="organization_id">
					<option value="">All</option>
					{#each data.organizations as org}
						<option
							value={org.id}
							selected={data.filters.organization_id === String(org.id)}
						>
							{org.name}
						</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="priority" class="mb-1 block text-xs text-gray-500">Priority</label>
				<select id="priority" name="priority">
					<option value="">All</option>
					<option value="low" selected={data.filters.priority === 'low'}>Low</option>
					<option value="medium" selected={data.filters.priority === 'medium'}>Medium</option>
					<option value="high" selected={data.filters.priority === 'high'}>High</option>
					<option value="urgent" selected={data.filters.priority === 'urgent'}>Urgent</option>
				</select>
			</div>
			<div>
				<label for="status" class="mb-1 block text-xs text-gray-500">Status</label>
				<select id="status" name="status">
					<option value="">All</option>
					<option value="open" selected={data.filters.status === 'open'}>Open</option>
					<option value="on-hold" selected={data.filters.status === 'on-hold'}>On Hold</option>
					<option value="resolved" selected={data.filters.status === 'resolved'}>
						Resolved
					</option>
					<option value="archived" selected={data.filters.status === 'archived'}>
						Archived
					</option>
				</select>
			</div>
			<div>
				<label for="sla_status" class="mb-1 block text-xs text-gray-500">SLA Status</label>
				<select id="sla_status" name="sla_status">
					<option value="">All</option>
					<option value="on-track" selected={data.filters.sla_status === 'on-track'}>
						On Track
					</option>
					<option value="due-soon" selected={data.filters.sla_status === 'due-soon'}>
						Due Soon
					</option>
					<option value="overdue" selected={data.filters.sla_status === 'overdue'}>
						Overdue
					</option>
				</select>
			</div>
			<div>
				<label for="started_from" class="mb-1 block text-xs text-gray-500">Started From</label>
				<input
					id="started_from"
					name="started_from"
					type="date"
					value={data.filters.started_from ?? ''}
				/>
			</div>
			<div>
				<label for="started_to" class="mb-1 block text-xs text-gray-500">Started To</label>
				<input
					id="started_to"
					name="started_to"
					type="date"
					value={data.filters.started_to ?? ''}
				/>
			</div>
			<div>
				<label for="due_from" class="mb-1 block text-xs text-gray-500">Due From</label>
				<input
					id="due_from"
					name="due_from"
					type="date"
					value={data.filters.due_from ?? ''}
				/>
			</div>
			<div>
				<label for="due_to" class="mb-1 block text-xs text-gray-500">Due To</label>
				<input id="due_to" name="due_to" type="date" value={data.filters.due_to ?? ''} />
			</div>
		</div>

		<div class="mt-3 flex gap-2">
			<button
				type="submit"
				class="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
			>
				Apply
			</button>
			<button
				type="button"
				onclick={clearFilters}
				class="cursor-pointer rounded-md border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
			>
				Clear
			</button>
		</div>
	</form>
{/if}

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
								href="/agent/tickets/{ticket.id}"
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
