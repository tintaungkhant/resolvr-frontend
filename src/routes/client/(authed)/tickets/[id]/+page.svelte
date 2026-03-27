<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);

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

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<a href="/client/tickets" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back</a>
		<h1 class="text-xl font-semibold text-gray-900">#{data.ticket.id} {data.ticket.title}</h1>
	</div>

	<!-- Ticket Details -->
	<div class="rounded-lg border border-gray-200 bg-white p-6">
		<div class="flex flex-wrap gap-4">
			<div>
				<span class="text-xs uppercase text-gray-500">Priority</span>
				<div>
					<span
						class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {priorityColors[
							data.ticket.priority
						] ?? ''}"
					>
						{data.ticket.priority}
					</span>
				</div>
			</div>
			<div>
				<span class="text-xs uppercase text-gray-500">Status</span>
				<div>
					<span
						class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
							data.ticket.status
						] ?? ''}"
					>
						{data.ticket.status}
					</span>
				</div>
			</div>
			<div>
				<span class="text-xs uppercase text-gray-500">Created</span>
				<p class="text-sm text-gray-700">
					{new Date(data.ticket.created_at).toLocaleString()}
				</p>
			</div>
			{#if data.ticket.due_at}
				<div>
					<span class="text-xs uppercase text-gray-500">Due</span>
					<p class="text-sm text-gray-700">
						{new Date(data.ticket.due_at).toLocaleString()}
					</p>
				</div>
			{/if}
		</div>
		<p class="mt-4 text-sm text-gray-700">{data.ticket.description}</p>
	</div>

	<!-- Messages -->
	<div class="rounded-lg border border-gray-200 bg-white">
		<div class="border-b border-gray-200 px-6 py-3">
			<h2 class="font-medium text-gray-900">Messages</h2>
		</div>

		<div class="divide-y divide-gray-100 p-6">
			{#each data.messages as message}
				<div class="py-4 first:pt-0 last:pb-0">
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
					<p class="mt-1 text-sm text-gray-700">{message.content}</p>
				</div>
			{/each}

			{#if data.messages.length === 0}
				<p class="py-4 text-center text-sm text-gray-500">No messages yet.</p>
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
					class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
				<button
					type="submit"
					disabled={loading}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					Send
				</button>
			</form>
		</div>
	</div>
</div>
