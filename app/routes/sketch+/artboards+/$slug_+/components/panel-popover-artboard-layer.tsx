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
import { Separator } from '#app/components/ui/separator'
import { type ILayer } from '#app/models/layer.server'
import { PanelFormArtboardLayerDelete } from './panel-form-artboard-layer-delete'
import { PanelFormArtboardLayerEditDescription } from './panel-form-artboard-layer-edit-description'

export const PanelPopoverArtboardLayer = ({
	artboardId,
	layer,
}: {
	artboardId: Artboard['id']
	layer: ILayer
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
							<span className="sr-only">Layer Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Layer</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this layer.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									defaultValue={layer.name}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="description">Description</Label>
								<PanelFormArtboardLayerEditDescription
									artboardId={artboardId}
									layer={layer}
								/>
							</div>
							<Separator className="my-4" />
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="delete">Delete</Label>
								<PanelFormArtboardLayerDelete
									id={layer.id}
									artboardId={artboardId}
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
