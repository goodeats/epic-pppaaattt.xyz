import { type Artboard } from '@prisma/client'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { type ILayout } from '#app/models/layout.server'
import { PanelFormArtboardDesignEditLayoutColumns } from './panel-form-artboard-design-edit-layout-columns'
import { PanelFormArtboardDesignEditLayoutRows } from './panel-form-artboard-design-edit-layout-rows'
import { PanelFormArtboardDesignEditLayoutStyle } from './panel-form-artboard-design-edit-layout-style'

export const PanelPopoverArtboardDesignLayout = ({
	artboardId,
	layout,
}: {
	artboardId: Artboard['id']
	layout: ILayout
}) => {
	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="m-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center"
					>
						<Icon name="gear">
							<span className="sr-only">Layout Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Layout</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this layout.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Style</Label>
								<PanelFormArtboardDesignEditLayoutStyle
									artboardId={artboardId}
									layout={layout}
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="count">Count</Label>
								<Input
									id="count"
									defaultValue={layout.count}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="rows">Rows</Label>
								<PanelFormArtboardDesignEditLayoutRows
									artboardId={artboardId}
									layout={layout}
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="columns">Columns</Label>
								<PanelFormArtboardDesignEditLayoutColumns
									artboardId={artboardId}
									layout={layout}
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
