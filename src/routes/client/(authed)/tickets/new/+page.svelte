<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<div>
	<div class="mb-4 flex items-center gap-3">
		<a href="/client/tickets" class="text-sm text-gray-400 no-underline hover:text-gray-600">
			&larr; Back
		</a>
		<h1 class="text-xl font-semibold text-gray-900">New Ticket</h1>
	</div>

	{#if form?.error}
		<div class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{form.error}</div>
	{/if}

	<div class="rounded-lg border border-gray-200 bg-white p-6">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="mb-4">
				<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
				<input id="title" name="title" type="text" required maxlength="255" value={form?.title ?? ''} />
				{#if form?.errors?.title}
					<p class="mt-1 text-sm text-red-600">{form.errors.title[0]}</p>
				{/if}
			</div>

			<div class="mb-4">
				<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea id="description" name="description" required maxlength="3000" rows="5"
					>{form?.description ?? ''}</textarea
				>
				{#if form?.errors?.description}
					<p class="mt-1 text-sm text-red-600">{form.errors.description[0]}</p>
				{/if}
			</div>

			<div class="mb-6">
				<label for="priority" class="mb-1 block text-sm font-medium text-gray-700">
					Priority
				</label>
				<select id="priority" name="priority" required>
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
					class="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 no-underline hover:bg-gray-50"
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
</div>
