<script>
	import { resolve } from '$app/paths';
	import DataTable from '$lib/components/data-table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { StudentService } from '$lib/core/services';
	import { Plus } from '@lucide/svelte';

	import { columns } from './columns.ts';

	// La promesa que obtiene los datos
	const studentsPromise = StudentService.getAllStudents();
</script>

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Gestión de Estudiantes</h1>
	<Button href={resolve('/dashboard/admin/students/new')}>
		<Plus class="mr-2 h-4 w-4" />Agregar Estudiante
	</Button>
</div>

<div class="rounded-md border">
	{#await studentsPromise}
		<p class="p-4 text-center">Cargando estudiantes...</p>
	{:then students}
		<DataTable {data} {columns} />
	{:catch error}
		<p class="p-4 text-center text-destructive">
			Error al cargar los estudiantes: {error.message}
		</p>
	{/await}
</div>
