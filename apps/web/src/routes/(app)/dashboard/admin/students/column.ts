import type { UserResponse } from '$lib/core/services/types';
import { createColumnHelper } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import StatusBadge from './StatusBadge.svelte';
import ActionsCell from './ActionsCell.svelte';

const columnHelper = createColumnHelper<UserResponse>();

export const columns = [
	columnHelper.accessor((row) => `${row.name ?? ''} ${row.surname ?? ''}`.trim(), {
		id: 'fullName',
		header: 'Nombre Completo',
		cell: (info) => info.getValue() || 'N/A'
	}),

	columnHelper.accessor('email', {
		header: 'Email',
		cell: (info) => info.getValue()
	}),

	columnHelper.accessor('status', {
		header: 'Estado',
		cell: (info) => renderComponent(StatusBadge, { value: info.getValue() })
	}),

	columnHelper.display({
		id: 'actions',
		header: 'Acciones',
		cell: ({ row }) => renderComponent(ActionsCell, { row })
	})
];
