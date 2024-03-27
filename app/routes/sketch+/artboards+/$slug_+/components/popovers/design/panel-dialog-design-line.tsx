import { Button } from '#app/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '#app/components/ui/dialog'
import { Icon } from '#app/components/ui/icon'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type ILine } from '#app/models/line.server'
import { PanelFormDesignLineEditBasis } from '../../forms/design/panel-form-design-line-edit-basis'
import { PanelFormDesignLineEditFormat } from '../../forms/design/panel-form-design-line-edit-format'

export const PanelDialogDesignLine = ({ line }: { line: ILine }) => {
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
							<span className="sr-only">Line Settings</span>
						</Icon>
					</Button>
				</DialogTrigger>
				<DialogContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Line</h4>
							<p className="text-sm text-muted-foreground">
								Settings for this line.
							</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="width">Width</Label>
								<Input
									id="width"
									defaultValue={line.width}
									className="col-span-2 h-8"
									disabled
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Format</Label>
								<PanelFormDesignLineEditFormat line={line} />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="style">Basis</Label>
								<PanelFormDesignLineEditBasis line={line} />
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
