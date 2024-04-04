import { SidebarPanelRowValuesContainer } from '#app/components/templates'
import { Icon } from '#app/components/ui/icon'
import { type ISize } from '#app/models/size.server'
import {
	SizeFormatTypeEnum,
	sizeBasisIcon,
	type sizeBasisTypeEnum,
	sizeFormatIcon,
	type sizeFormatTypeEnum,
} from '#app/schema/size'
import { PanelFormDesignSizeEditValue } from '../../../forms/design/panel-form-design-size-edit-value'
import { PanelPopoverDesignSize } from '../../../popovers/design/panel-popover-design-size'

export const PanelDesignTypeRowValuesSize = ({ size }: { size: ISize }) => {
	const SizeFormatIcon = () => {
		const icon = sizeFormatIcon(size.format as sizeFormatTypeEnum)
		return (
			<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
				<span className="text-body-xs leading-none">{icon}</span>
			</div>
		)
	}

	const SizeBasisIcon = () => {
		if (size.format === SizeFormatTypeEnum.PIXEL) return null

		const icon = sizeBasisIcon(size.basis as sizeBasisTypeEnum)
		return (
			<div className="m-2 mr-0 flex h-8 w-8 items-center justify-center">
				<Icon name={icon}>
					<span className="sr-only">Size Basis: {size.basis}</span>
				</Icon>
			</div>
		)
	}

	return (
		<SidebarPanelRowValuesContainer>
			<PanelPopoverDesignSize size={size} />
			<PanelFormDesignSizeEditValue size={size} />
			<SizeFormatIcon />
			<SizeBasisIcon />
		</SidebarPanelRowValuesContainer>
	)
}
