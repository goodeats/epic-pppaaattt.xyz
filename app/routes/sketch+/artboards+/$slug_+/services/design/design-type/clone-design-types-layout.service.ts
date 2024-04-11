import {
	type IDesignWithLayout,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from './clone-design-types.service'

export class CloneLayoutDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.LAYOUT

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithLayout
	}): IDesignTypeCreateOverrides {
		const { layout } = design
		const { style, count, rows, columns } = layout
		return {
			style,
			count,
			rows,
			columns,
		}
	}
}
