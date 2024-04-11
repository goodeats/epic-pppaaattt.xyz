import {
	type IDesignWithStroke,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from './clone-design-types.service'

export class CloneStrokeDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.STROKE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithStroke
	}): IDesignTypeCreateOverrides {
		const { stroke } = design
		const { style, value, basis } = stroke
		return {
			style,
			value,
			basis,
		}
	}
}
