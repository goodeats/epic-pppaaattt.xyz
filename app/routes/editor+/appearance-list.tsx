import { type Artboard } from '@prisma/client'
import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '#app/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { Icon } from '#app/components/ui/icon'
import { type AppearanceType } from '#app/utils/appearances'
import {
	type IAppearance,
	type IAppearancesOnArtboard,
} from '#app/utils/db.server'
import { AddArtboardAppearanceForm } from './add-artboard-appearance-form'

type PaletteListProps = {
	artboard: Pick<Artboard, 'id' | 'name'>
	artboardAppearanceTypes: Array<
		Pick<
			IAppearancesOnArtboard,
			'id' | 'order' | 'isVisible' | 'artboardId'
		> & {
			appearance: Pick<
				IAppearance,
				'id' | 'name' | 'description' | 'slug' | 'value'
			>
		}
	>
	appearanceType: AppearanceType
}

export const AppearanceList = ({
	artboard,
	artboardAppearanceTypes,
	appearanceType,
}: PaletteListProps) => {
	const AppearanceTypeListItems = () => {
		return (
			<>
				{artboardAppearanceTypes.map(
					({ appearance, artboardId, isVisible, order }) => {
						return (
							<AppearanceListItem
								key={appearance.id}
								appearance={{
									id: appearance.id,
									name: appearance.name,
									description: appearance.description,
									slug: appearance.slug,
									value: appearance.value,
									artboardId,
									isVisible,
									order,
								}}
							/>
						)
					},
				)}
			</>
		)
	}

	return (
		<div className="mt-2 space-y-4 px-4">
			<div className="grid gap-6">
				<AppearanceTypeListItems />
			</div>
			<AddArtboardAppearanceForm
				artboard={artboard}
				artboardAppearances={artboardAppearanceTypes.map(
					artboard => artboard.appearance,
				)}
				appearanceType={appearanceType}
			/>
		</div>
	)
}

type AppearanceListItemProps = {
	appearance: {
		id: string
		name: string
		description: string
		slug: string
		value: string
		artboardId: string
		isVisible: boolean
		order: number
	}
}

const AppearanceListItem = ({ appearance }: AppearanceListItemProps) => {
	const { name, isVisible } = appearance

	const Details = () => {
		return (
			<div className="flex items-center space-x-4">
				<div>
					<p className="text-sm font-medium leading-none">{name}</p>
					<p className="text-sm text-muted-foreground">
						{isVisible ? 'Visible' : 'Hidden'}
					</p>
				</div>
			</div>
		)
	}

	const EditAction = () => {
		return (
			// <EditArtboardAppearanceForm
			// 	artboard={artboard}
			// 	appearance={appearance}
			// 	appearanceType={AppearanceType.Palette}
			// />
			<Dialog>
				<DialogTrigger asChild>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>
						Edit
					</DropdownMenuItem>
				</DialogTrigger>
				<DialogContent>testing....</DialogContent>
			</Dialog>
		)
	}

	const Actions = () => {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
					>
						<Icon name="dots-horizontal"></Icon>
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<EditAction />
					<DropdownMenuSeparator />
					<DropdownMenuItem>Move to Top</DropdownMenuItem>
					<DropdownMenuItem>Move Up</DropdownMenuItem>
					<DropdownMenuItem>Move Down</DropdownMenuItem>
					<DropdownMenuItem>Move to Bottom</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Show/Hide</DropdownMenuItem>
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
			<Details />
			<Actions />
		</div>
	)
}
