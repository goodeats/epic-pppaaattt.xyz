import { type Artboard } from '@prisma/client'
import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '#app/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { Icon } from '#app/components/ui/icon'
import { type AppearanceType } from '#app/utils/appearances'
import {
	type IAppearance,
	type IAppearancesOnArtboard,
} from '#app/utils/db.server'
import { RemoveArtboardAppearanceForm } from './__remove-artboard-appearance-form'
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
	return (
		<div className="mt-2 space-y-4 px-4">
			<div className="grid gap-6">
				{artboardAppearanceTypes.map(
					({ appearance, artboardId, isVisible, order }) => {
						return (
							<div
								key={appearance.id}
								className="flex items-center justify-between space-x-4"
							>
								<div className="flex items-center space-x-4">
									<div>
										<p className="text-sm font-medium leading-none">
											{appearance.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{isVisible ? 'Visible' : 'Hidden'}
										</p>
									</div>
								</div>
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
										<Dialog>
											<DialogTrigger asChild>
												<DropdownMenuItem onSelect={e => e.preventDefault()}>
													Edit
												</DropdownMenuItem>
											</DialogTrigger>
											<DialogContent>testing....</DialogContent>
										</Dialog>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Move to Top</DropdownMenuItem>
										<DropdownMenuItem>Move Up</DropdownMenuItem>
										<DropdownMenuItem>Move Down</DropdownMenuItem>
										<DropdownMenuItem>Move to Bottom</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Show/Hide</DropdownMenuItem>
										<DropdownMenuSeparator />
										<RemoveArtboardAppearanceForm
											artboardId={artboard.id}
											appearanceId={appearance.id}
										/>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)
					},
				)}
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
