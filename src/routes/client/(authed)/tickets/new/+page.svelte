<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<div class="space-y-4">
	<div class="flex items-center gap-3">
		<a href="/client/tickets" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back</a>
		<h1 class="text-xl font-semibold text-gray-900">New Ticket</h1>
	</div>

	{#if form?.error}
		<div class="rounded-md bg-red-50 p-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
	>
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
			<input
				id="title"
				name="title"
				type="text"
				required
				maxlength="255"
				value={form?.title ?? ''}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
			/>
			{#if form?.errors?.title}
				<p class="mt-1 text-sm text-red-600">{form.errors.title[0]}</p>
			{/if}
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
			<textarea
				id="description"
				name="description"
				required
				maxlength="3000"
				rows="5"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
			>{form?.description ?? ''}</textarea>
			{#if form?.errors?.description}
				<p class="mt-1 text-sm text-red-600">{form.errors.description[0]}</p>
			{/if}
		</div>

		<div>
			<label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
			<select
				id="priority"
				name="priority"
				required
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
			>
				<option value="low" selected={form?.priority === 'low'}>Low</option>
				<option value="medium" selected={form?.priority === 'medium' || !form?.priority}>
					Medium
				</option>
				<option value="high" selected={form?.priority === 'high'}>High</option>
				<option value="urgent" selected={form?.priority === 'urgent'}>Urgent</option>
			</select>
			{#if form?.errors?.priority}
				<p class="mt-1 text-sm text-red-600">{form.errors.priority[0]}</p>
			{/if}
		</div>

		<div class="flex justify-end gap-3">
			<a
				href="/client/tickets"
				class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Cancel
			</a>
			<button
				type="submit"
				disabled={loading}
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Creating...' : 'Create Ticket'}
			</button>
		</div>
	</form>
</div>
