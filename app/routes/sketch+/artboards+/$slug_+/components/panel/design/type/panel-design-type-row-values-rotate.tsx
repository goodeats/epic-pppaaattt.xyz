import {
	SidebarPanelRowValuesContainer,
	SidebarPanelRowValuesDisabled,
} from '#app/components/templates'
import { type IRotate } from '#app/models/rotate.server'
import { RotateBasisTypeEnum } from '#app/schema/rotate'
import { PanelFormDesignRotateEditValue } from '../../../forms/design/panel-form-design-rotate-edit-value'
import { PanelPopoverDesignRotate } from '../../../popovers/design/panel-popover-design-rotate'

export const PanelDesignTypeRowValuesRotate = ({
	rotate,
}: {
	rotate: IRotate
}) => {
	const RotateBasisIcon = () => {
		if (rotate.basis !== RotateBasisTypeEnum.DEFINED) return null

		return (
			<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
				<span className="text-body-xs leading-none">°</span>
			</div>
		)
	}

	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignRotate rotate={rotate} />
			{rotate.basis !== 'defined' ? (
				<SidebarPanelRowValuesDisabled value={rotate.basis} />
			) : (
				<PanelFormDesignRotateEditValue rotate={rotate} />
			)}
			<RotateBasisIcon />
		</SidebarPanelRowValuesContainer>
	)
}
