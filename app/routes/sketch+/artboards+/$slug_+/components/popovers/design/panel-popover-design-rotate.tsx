import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { type IRotate } from '#app/models/rotate.server'
import { PanelFormDesignRotateEditBasis } from '../../forms/design/panel-form-design-rotate-edit-basis'

export const PanelPopoverDesignRotate = ({ rotate }: { rotate: IRotate }) => {
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
							<span className="sr-only">Rotate Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Rotate</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this rotate.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="rotation">Rotation</Label>
								<Input
									id="rotation"
									defaultValue={rotate.rotation}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="basis">Basis</Label>
								<PanelFormDesignRotateEditBasis rotate={rotate} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
