import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '#app/components/ui/dialog'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type IRotate } from '#app/models/rotate.server'
import { PanelFormDesignRotateEditBasis } from '../../forms/design/panel-form-design-rotate-edit-basis'

export const PanelDialogDesignRotate = ({ rotate }: { rotate: IRotate }) => {
	return (
		<div>
			<Dialog modal={false}>
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="m-2 mr-0 flex h-8 w-8 cursor-pointer items-center justify-center"
					>
						<Icon name="gear">
							<span className="sr-only">Rotate Settings</span>
						</Icon>
					</Button>
				</DialogTrigger>
				<DialogContent className="w-80">
					<span tabIndex={0} className="sr-only" />
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Rotate</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this rotate.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="value">Value</Label>
								<Input
									id="value"
									defaultValue={rotate.value}
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
				</DialogContent>
			</Dialog>
		</div>
	)
}
