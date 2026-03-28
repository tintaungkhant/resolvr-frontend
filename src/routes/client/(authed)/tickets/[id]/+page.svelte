<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
	let countdown = $state('');

	function formatCountdown(dueAt: string): string {
		const diff = new Date(dueAt).getTime() - Date.now();
		if (diff <= 0) return 'Overdue';
		const days = Math.floor(diff / 86400000);
		const hours = Math.floor((diff % 86400000) / 3600000);
		const minutes = Math.floor((diff % 3600000) / 60000);
		const seconds = Math.floor((diff % 60000) / 1000);
		if (days > 0) return `${days}d ${hours}h ${minutes}m`;
		if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
		return `${minutes}m ${seconds}s`;
	}

	let isOnHold = $derived(data.ticket.status === 'on-hold');

	$effect(() => {
		const dueAt = data.ticket.due_at;
		if (!dueAt || isOnHold) return;
		countdown = formatCountdown(dueAt);
		const timer = setInterval(() => {
			countdown = formatCountdown(dueAt);
		}, 1000);
		return () => clearInterval(timer);
	});
	let loadingMore = $state(false);
	let extraMessages = $state<any[]>([]);
	let extraPagesLoaded = $state(0);

	let allMessages = $derived([...extraMessages, ...data.messages]);
	let nextPage = $derived((data.messagesMeta?.current_page ?? 1) + 1 + extraPagesLoaded);
	let hasMore = $derived(nextPage <= (data.messagesMeta?.last_page ?? 1));

	async function loadMore() {
		loadingMore = true;
		const res = await fetch(`?page=${nextPage}`, {
			headers: { Accept: 'application/json' }
		});
		const result = await res.json();
		extraMessages = [...result.messages, ...extraMessages];
		extraPagesLoaded++;
		loadingMore = false;
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

	const slaStatusColors: Record<string, string> = {
		'on-track': 'bg-green-100 text-green-700',
		'due-soon': 'bg-yellow-100 text-yellow-700',
		overdue: 'bg-red-100 text-red-700'
	};

	let assigneeName = $derived(data.ticket.assignee?.name ?? 'Unassigned');
</script>

<div>
	<div class="mb-4 flex items-center gap-3">
		<a href="/client/tickets" class="text-sm text-gray-400 no-underline hover:text-gray-600">
			&larr; Back
		</a>
		<h1 class="text-xl font-semibold text-gray-900">#{data.ticket.id} {data.ticket.title}</h1>
	</div>

	<!-- Ticket Details -->
	<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6">
		<div class="flex flex-wrap gap-6">
			<div>
				<div class="mb-1 text-xs uppercase text-gray-400">Priority</div>
				<span
					class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {priorityColors[
						data.ticket.priority
					] ?? ''}"
				>
					{data.ticket.priority}
				</span>
			</div>
			<div>
				<div class="mb-1 text-xs uppercase text-gray-400">Status</div>
				<span
					class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
						data.ticket.status
					] ?? ''}"
				>
					{data.ticket.status}
				</span>
			</div>
			<div>
				<div class="mb-1 text-xs uppercase text-gray-400">SLA Status</div>
				<span
					class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {slaStatusColors[
						data.ticket.sla_status
					] ?? 'bg-gray-100 text-gray-500'}"
				>
					{data.ticket.sla_status ?? '-'}
				</span>
			</div>
			<div>
				<div class="mb-1 text-xs uppercase text-gray-400">Assignee</div>
				<div class="text-sm text-gray-700">
					{assigneeName}
				</div>
			</div>
			<div>
				<div class="mb-1 text-xs uppercase text-gray-400">Created</div>
				<div class="text-sm text-gray-700">
					{new Date(data.ticket.created_at).toLocaleString()}
				</div>
			</div>
			{#if data.ticket.due_at}
				<div>
					<div class="mb-1 text-xs uppercase text-gray-400">Due</div>
					<div class="text-sm text-gray-700">
						{new Date(data.ticket.due_at).toLocaleString()}
					</div>
				</div>
				<div>
					<div class="mb-1 text-xs uppercase text-gray-400">Time Left</div>
					{#if isOnHold}
						<div class="text-sm font-medium text-yellow-600">Paused</div>
					{:else}
						<div
							class="text-sm font-medium {countdown === 'Overdue'
								? 'text-red-600'
								: 'text-gray-700'}"
						>
							{countdown}
						</div>
					{/if}
				</div>
			{/if}
			{#if isOnHold}
				<div class="flex w-full items-center gap-2 rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
					SLA clock is paused while ticket is on hold.
				</div>
			{/if}
		</div>
	</div>

	<!-- Messages -->
	<div class="rounded-lg border border-gray-200 bg-white">
		<div class="border-b border-gray-200 px-6 py-3">
			<h2 class="text-sm font-medium text-gray-900">Messages</h2>
		</div>

		<div class="p-6">
			{#if allMessages.length === 0}
				<p class="text-center text-sm text-gray-400">No messages yet.</p>
			{:else}
				{#if hasMore}
					<div class="mb-4 border-b border-gray-100 pb-4 text-center">
						<button
							onclick={loadMore}
							disabled={loadingMore}
							class="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
						>
							{loadingMore ? 'Loading...' : 'Load older messages'}
						</button>
					</div>
				{/if}

				{#each allMessages as message, i}
					<div class="{i > 0 ? 'mt-4 border-t border-gray-100 pt-4' : ''}">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-900">
								{message.user?.name ?? 'Unknown'}
							</span>
							<span
								class="rounded-full px-1.5 py-0.5 text-xs {message.user?.role === 'agent'
									? 'bg-purple-100 text-purple-700'
									: 'bg-blue-100 text-blue-700'}"
							>
								{message.user?.role ?? 'user'}
							</span>
							<span class="text-xs text-gray-400">
								{new Date(message.created_at).toLocaleString()}
							</span>
						</div>
						<p class="mt-1 text-sm text-gray-600">{message.content}</p>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Send Message -->
		<div class="border-t border-gray-200 p-4">
			{#if form?.error}
				<div class="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/message"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						extraMessages = [];
						extraPagesLoaded = 0;
						await update();
					};
				}}
				class="flex gap-3"
			>
				<input
					name="content"
					type="text"
					required
					maxlength="3000"
					placeholder="Type a message..."
					class="flex-1"
				/>
				<button
					type="submit"
					disabled={loading}
					class="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					Send
				</button>
			</form>
		</div>
	</div>
</div>
