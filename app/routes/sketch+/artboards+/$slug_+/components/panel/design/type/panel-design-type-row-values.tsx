import {
	type IDesignWithPalette,
	type IDesignWithLayout,
	type IDesignWithType,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
	type IDesignWithRotate,
	type IDesignWithTemplate,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { PanelDesignTypeRowValuesFill } from './panel-design-type-row-values-fill'
import { PanelDesignTypeRowValuesLayout } from './panel-design-type-row-values-layout'
import { PanelDesignTypeRowValuesLine } from './panel-design-type-row-values-line'
import { PanelDesignTypeRowValuesPalette } from './panel-design-type-row-values-palette'
import { PanelDesignTypeRowValuesRotate } from './panel-design-type-row-values-rotate'
import { PanelDesignTypeRowValuesSize } from './panel-design-type-row-values-size'
import { PanelDesignTypeRowValuesStroke } from './panel-design-type-row-values-stroke'
import { PanelDesignTypeRowValuesTemplate } from './panel-design-type-row-values-template'

export const PanelDesignTypeRowValues = ({
	type,
	design,
}: {
	type: designTypeEnum
	design: IDesignWithType
}) => {
	switch (type) {
		case DesignTypeEnum.LAYOUT:
			const { layout } = design as IDesignWithLayout
			return <PanelDesignTypeRowValuesLayout layout={layout} />
		case DesignTypeEnum.PALETTE:
			const { palette } = design as IDesignWithPalette
			return <PanelDesignTypeRowValuesPalette palette={palette} />
		case DesignTypeEnum.SIZE:
			const { size } = design as IDesignWithSize
			return <PanelDesignTypeRowValuesSize size={size} />
		case DesignTypeEnum.FILL:
			const { fill } = design as IDesignWithFill
			return <PanelDesignTypeRowValuesFill fill={fill} />
		case DesignTypeEnum.STROKE:
			const { stroke } = design as IDesignWithStroke
			return <PanelDesignTypeRowValuesStroke stroke={stroke} />
		case DesignTypeEnum.LINE:
			const { line } = design as IDesignWithLine
			return <PanelDesignTypeRowValuesLine line={line} />
		case DesignTypeEnum.ROTATE:
			const { rotate } = design as IDesignWithRotate
			return <PanelDesignTypeRowValuesRotate rotate={rotate} />
		case DesignTypeEnum.TEMPLATE:
			const { template } = design as IDesignWithTemplate
			return <PanelDesignTypeRowValuesTemplate template={template} />
		default:
			return null
	}
}
