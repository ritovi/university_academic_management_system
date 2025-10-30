<script lang="ts">
	import { StudentService } from '$lib/core/services';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import {
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
		type PaginationState,
		type SortingState
	} from '@tanstack/table-core';
	import type { UserResponse } from '$lib/core/services/types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { columns } from './column';

	const studentsPromise = StudentService.getAllStudents();

	let sorting: SortingState = $state([]);
	let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 });
	let globalFilter = $state('');

	function createTable(data: UserResponse[]) {
		return createSvelteTable({
			data,
			columns,
			state: {
				get sorting() {
					return sorting;
				},
				get pagination() {
					return pagination;
				},
				get globalFilter() {
					return globalFilter;
				}
			},
			onSortingChange: (updater) => {
				sorting = typeof updater === 'function' ? updater(sorting) : updater;
			},
			onPaginationChange: (updater) => {
				pagination = typeof updater === 'function' ? updater(pagination) : updater;
			},
			onGlobalFilterChange: (updater) => {
				globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
			},
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel()
		});
	}
</script>

<svelte:head>
	<title>Estudiantes - Admin Dashboard</title>
</svelte:head>

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Gestión de Estudiantes</h1>
	<Button href={resolve('/dashboard/admin/students/new')}>
		<Plus class="mr-2 h-4 w-4" />Agregar Estudiante
	</Button>
</div>

{#await studentsPromise}
	<div class="rounded-md border p-4 text-center">
		<p>Cargando estudiantes...</p>
	</div>
{:then students}
	{@const table = createTable(students)}

	<div class="mb-4 flex items-center">
		<Input
			placeholder="Buscar en todas las columnas..."
			bind:value={globalFilter}
			class="max-w-sm"
		/>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if header.isPlaceholder}
									<div></div>
								{:else}
									<button
										class="flex items-center gap-2"
										onclick={header.column.getToggleSortingHandler()}
									>
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
										{{
											asc: ' 🔼',
											desc: ' 🔽'
										}[header.column.getIsSorted() as string] ?? ''}
									</button>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No se encontraron resultados.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-between space-x-2 p-2">
		<div class="text-sm text-muted-foreground">
			{table.getFilteredRowModel().rows.length} fila(s)
		</div>
		<div class="flex items-center space-x-6 lg:space-x-8">
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium">Filas por página</p>
				<Select.Root
					type="single"
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => table.setPageSize(Number(value))}
				>
					<Select.Trigger class="h-8 w-[70px]">
						{table.getState().pagination.pageSize}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [5, 10, 20, 50] as pageSize (pageSize)}
							<Select.Item value={`${pageSize}`}>{pageSize}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex w-[100px] items-center justify-center text-sm font-medium">
				Página {table.getState().pagination.pageIndex + 1} de
				{table.getPageCount()}
			</div>
			<div class="flex items-center space-x-2">
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Ir a primera página</span>
					<ChevronsLeft class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					class="h-8 w-8 p-0"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Ir a página anterior</span>
					<ChevronLeft class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					class="h-8 w-8 p-0"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Ir a página siguiente</span>
					<ChevronRight class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Ir a última página</span>
					<ChevronsRight class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
{:catch error}
	<div class="rounded-md border p-4 text-center">
		<p class="text-destructive">
			Error al cargar los estudiantes: {error.message}
		</p>
	</div>
{/await}
