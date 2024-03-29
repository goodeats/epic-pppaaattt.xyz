import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { type IFill } from '#app/models/fill.server'
import { PanelFormDesignFillEditBasis } from '../../forms/design/panel-form-design-fill-edit-basis'
import { PanelFormDesignFillEditStyle } from '../../forms/design/panel-form-design-fill-edit-style'

export const PanelPopoverDesignFill = ({ fill }: { fill: IFill }) => {
	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="m-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center"
						style={{ backgroundColor: `#${fill.value}` }}
					>
						<Icon name="gear">
							<span className="sr-only">Fill Settings</span>
						</Icon>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Fill</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this fill.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Style</Label>
								<PanelFormDesignFillEditStyle fill={fill} />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="value">Value</Label>
								<Input
									id="value"
									defaultValue={fill.value}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="basis">Basis</Label>
								<PanelFormDesignFillEditBasis fill={fill} />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
