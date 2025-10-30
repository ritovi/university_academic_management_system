<script lang="ts">
	import type { UserResponse } from '$lib/core/services/types';
	import type { Row } from '@tanstack/table-core';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { goto } from '$app/navigation';

	import { MoreHorizontal, Pencil, Trash2 } from '@lucide/svelte';

	let { row }: { row: Row<UserResponse> } = $props();
	const studentId = row.original.id;

	function handleEdit() {
		goto(`/dashboard/admin/students/${studentId}/edit`);
	}

	// TODO: Implement deactivate/delet logic
	function handleDelete() {
		console.log('Eliminar/Desactivar:', studentId);
		// StudentService.updateStudentStatus(studentId, { status: false })
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" class="h-8 w-8 p-0" {...props}>
				<span class="sr-only">Abrir menú</span>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>Acciones</DropdownMenu.Label>

		<DropdownMenu.Item onSelect={handleEdit}>
			<Pencil class="mr-2 h-4 w-4" />
			Editar
		</DropdownMenu.Item>
		<DropdownMenu.Separator />

		<DropdownMenu.Item onSelect={handleDelete} class="text-destructive" variant="destructive">
			<Trash2 class="mr-2 h-4 w-4" />
			Desactivar
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
