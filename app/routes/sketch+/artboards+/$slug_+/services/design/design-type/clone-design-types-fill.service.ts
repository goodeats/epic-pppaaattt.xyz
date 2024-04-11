import {
	type IDesignTypeCreateOverrides,
	type IDesignWithFill,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from './clone-design-types.service'

export class CloneFillDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.FILL

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithFill
	}): IDesignTypeCreateOverrides {
		const { fill } = design
		const { style, value, basis } = fill
		return {
			style,
			value,
			basis,
		}
	}
}
