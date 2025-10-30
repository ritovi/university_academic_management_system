<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils.js';

	let { value }: { value: boolean | null | undefined } = $props();
</script>

<Badge
	variant="outline"
	class={cn('capitalize', value ? 'border-green-600/50 text-green-600' : 'text-muted-foreground')}
>
	<div
		class={cn('mr-2 h-2 w-2 rounded-full', value ? 'bg-green-600' : 'bg-muted-foreground')}
	></div>
	{value ? 'Activo' : 'Inactivo'}
</Badge>
