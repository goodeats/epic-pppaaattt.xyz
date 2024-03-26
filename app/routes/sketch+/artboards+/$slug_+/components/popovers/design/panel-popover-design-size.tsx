import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { type ISize } from '#app/models/size.server'
import { PanelFormDesignSizeEditBasis } from '../../forms/design/panel-form-design-size-edit-basis'
import { PanelFormDesignSizeEditFormat } from '../../forms/design/panel-form-design-size-edit-format'

export const PanelPopoverDesignSize = ({ size }: { size: ISize }) => {
	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="m-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center"
					>
						<Icon name="gear">
							<span className="sr-only">Size Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Size</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this size.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Format</Label>
								<PanelFormDesignSizeEditFormat size={size} />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="value">Value</Label>
								<Input
									id="value"
									defaultValue={size.value}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Basis</Label>
								<PanelFormDesignSizeEditBasis size={size} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
