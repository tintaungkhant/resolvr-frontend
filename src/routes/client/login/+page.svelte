<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold text-gray-900">Client Portal</h1>
			<p class="mt-1 text-sm text-gray-500">Sign in to your account</p>
		</div>

		<div class="rounded-lg border border-gray-200 bg-white p-6">
			{#if form?.error}
				<div class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{form.error}</div>
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
			>
				<div class="mb-4">
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
					<input id="email" name="email" type="email" required value={form?.email ?? ''} />
				</div>

				<div class="mb-6">
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
						Password
					</label>
					<input id="password" name="password" type="password" required />
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>
		</div>

		<p class="mt-4 text-center text-sm text-gray-500">
			<a href="/" class="text-blue-600 hover:underline">Back to home</a>
		</p>
	</div>
</div>
