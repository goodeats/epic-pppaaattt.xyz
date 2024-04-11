import {
	type IDesignWithSize,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from './clone-design-types.service'

export class CloneSizeDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.SIZE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithSize
	}): IDesignTypeCreateOverrides {
		const { size } = design
		const { format, value, basis } = size
		return {
			format,
			value,
			basis,
		}
	}
}
