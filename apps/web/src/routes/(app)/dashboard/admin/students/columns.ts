// /routes/dashboard/admin/students/columns.ts

import type { UserResponse } from '$lib/core/services/types'; // Asegúrate de que esta ruta sea correcta
import StatusBadge from './StatusBadge.svelte';
import ActionsCell from './ActionsCell.svelte';
import { createColumnHelper } from '@tanstack/table-core';

const columnHelper = createColumnHelper<UserResponse>();

export const columns = [
	// Columna: Nombre Completo
	columnHelper.accessor((row) => `${row.name ?? ''} ${row.surname ?? ''}`.trim(), {
		id: 'fullName',
		header: 'Nombre Completo',
		cell: (info) => info.getValue() || 'N/A'
	}),

	// Columna: Email
	columnHelper.accessor('email', {
		header: 'Email',
		cell: (info) => info.getValue()
	}),

	// Columna: Rol
	columnHelper.accessor('role', {
		header: 'Rol',
		cell: (info) => info.getValue()
	}),

	// Columna: Estado (usa el componente Svelte StatusBadge)
	columnHelper.accessor('status', {
		header: 'Estado',
		cell: StatusBadge // ¡Aquí pasamos el componente!
	}),

	// Columna: Acciones (usa el componente Svelte ActionsCell)
	columnHelper.display({
		id: 'actions',
		header: 'Acciones', // No se necesita 'h' para el header, usa texto simple
		cell: ActionsCell
	})
];
