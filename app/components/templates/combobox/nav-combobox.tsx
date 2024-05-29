import { type PopoverProps } from '@radix-ui/react-popover'
import { Link, useParams } from '@remix-run/react'
import { useState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '#app/components/ui/command'
import { Icon } from '#app/components/ui/icon'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { type IEntityWithSlug } from '#app/schema/entity'
import { cn } from '#app/utils/misc'
import { capitalize } from '#app/utils/string-formatting'

interface EntitySelectorProps extends PopoverProps {
	entities: IEntityWithSlug[]
	entitySingular?: string
	entityPlural?: string
	placeholder?: string
	slugParam?: string
	baseUrl: string
}

export function ComboboxNav({
	entities,
	entitySingular = 'entity',
	entityPlural = 'entities',
	placeholder = 'Select...',
	slugParam,
	baseUrl,
	...props
}: EntitySelectorProps) {
	const [open, setOpen] = useState(false)
	const params = useParams()
	const paramsSlug = slugParam ? params[slugParam] : params.slug
	const currentEntity = entities.find(entity => entity.slug === paramsSlug)

	return (
		<Popover open={open} onOpenChange={setOpen} {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-label={placeholder}
					aria-expanded={open}
					className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
				>
					{currentEntity?.name || placeholder}
					<Icon
						name="caret-sort"
						className="ml-2 h-4 w-4 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder={`Search ${entityPlural}...`} />
					<CommandEmpty>No {entityPlural} found.</CommandEmpty>
					<CommandGroup heading={capitalize(entityPlural)}>
						{entities.map(entity => (
							<CommandItem key={entity.id} onSelect={() => setOpen(false)}>
								<Link prefetch="intent" to={`${baseUrl}/${entity.slug}`}>
									{entity.name}
								</Link>
								<Icon
									name="check"
									className={cn(
										'ml-auto h-4 w-4',
										currentEntity?.id === entity.id
											? 'opacity-100'
											: 'opacity-0',
									)}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
