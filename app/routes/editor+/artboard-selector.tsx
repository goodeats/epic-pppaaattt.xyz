import { type Artboard } from '@prisma/client'
import { type PopoverProps } from '@radix-ui/react-popover'
import { useLoaderData, useNavigate } from '@remix-run/react'
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
import { cn } from '#app/utils/misc'
import { type loader } from './route'

type ArtboardPickedType = Pick<Artboard, 'id' | 'name' | 'slug'>

interface ArtboardSelectorProps extends PopoverProps {
	artboards: ArtboardPickedType[]
}

export function ArtboardSelector({
	artboards,
	...props
}: ArtboardSelectorProps) {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data

	const [open, setOpen] = useState(false)
	const [selectedArtboard, setSelectedArtboard] = useState<ArtboardPickedType>(
		artboard || { id: '', name: '', slug: '' },
	)
	const navigate = useNavigate()

	return (
		<Popover open={open} onOpenChange={setOpen} {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-label="Load an artboard..."
					aria-expanded={open}
					className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
				>
					{selectedArtboard?.name
						? selectedArtboard.name
						: 'Load an artboard...'}
					<Icon
						name="caret-sort"
						className="ml-2 h-4 w-4 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Search artboards..." />
					<CommandEmpty>No artboards found.</CommandEmpty>
					<CommandGroup heading="Examples">
						{artboards.map(artboard => (
							<CommandItem
								key={artboard.id}
								onSelect={() => {
									setSelectedArtboard(artboard)
									setOpen(false)
									navigate('?artboardId=' + artboard.id)
								}}
							>
								{artboard.name}
								<Icon
									name="check"
									className={cn(
										'ml-auto h-4 w-4',
										selectedArtboard?.id === artboard.id
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
