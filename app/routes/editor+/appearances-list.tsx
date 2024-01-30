import { useLoaderData } from '@remix-run/react'
import { Button } from '#app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { Icon } from '#app/components/ui/icon'
import { AppearanceType } from '#app/utils/appearances'
import { AddArtboardAppearanceForm } from './add-artboard-appearance-form'
import { type loader } from './route'

export const AppearancesList = () => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
	if (!artboard) return null

	const artboardAppearances = artboard.appearances
	const paletteAppearances = artboardAppearances.filter(appearance => {
		return appearance.appearance.type === 'palette'
	})

	return (
		<AppearanceListContainer>
			{paletteAppearances.map(({ appearance, isVisible, order }) => {
				return (
					<AppearanceListItem
						key={appearance.id}
						appearance={{
							id: appearance.id,
							name: appearance.name,
							description: appearance.description,
							slug: appearance.slug,
							value: appearance.value,
							isVisible,
							order,
						}}
					/>
				)
			})}
		</AppearanceListContainer>
	)
}

const AppearanceListContainer = ({
	children,
}: {
	children?: React.ReactNode
}) => {
	const data = useLoaderData<typeof loader>()
	const { artboard } = data
	if (!artboard) return null

	const artboardAppearances = artboard.appearances
	const paletteAppearances = artboardAppearances.filter(appearance => {
		return appearance.appearance.type === 'palette'
	})

	const artboardAppearancesAppearances = paletteAppearances.map(
		appearance => appearance.appearance,
	)

	return (
		<div className="mt-2 space-y-4 px-4">
			<h4 className="text-sm font-medium">Palette</h4>
			<div className="grid gap-6">{children}</div>
			<AddArtboardAppearanceForm
				artboard={artboard}
				artboardAppearances={artboardAppearancesAppearances}
				appearanceType={AppearanceType.Palette}
			/>
		</div>
	)
}

const AppearanceListItem = ({
	appearance,
}: {
	appearance: {
		id: string
		name: string
		description: string
		slug: string
		value: string
		isVisible: boolean
		order: number
	}
}) => {
	console.log('appearance', appearance)
	const { name, isVisible } = appearance

	const Actions = () => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
					>
						{/* <DotsHorizontalIcon className="h-4 w-4" /> */}
						<Icon name="dots-horizontal"></Icon>
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Move to Top</DropdownMenuItem>
					<DropdownMenuItem>Move Up</DropdownMenuItem>
					<DropdownMenuItem>Move Down</DropdownMenuItem>
					<DropdownMenuItem>Move to Bottom</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	return (
		<div className="flex items-center justify-between space-x-4">
			<div className="flex items-center space-x-4">
				<div>
					<p className="text-sm font-medium leading-none">{name}</p>
					<p className="text-sm text-muted-foreground">
						{isVisible ? 'Visible' : 'Hidden'}
					</p>
				</div>
			</div>
			<Actions />
		</div>
	)
}
