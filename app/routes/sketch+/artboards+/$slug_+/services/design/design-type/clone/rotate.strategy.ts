import {
	type IDesignWithRotate,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from '../clone.service'

export class CloneRotateDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.ROTATE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithRotate
	}): IDesignTypeCreateOverrides {
		const { rotate } = design
		const { value, basis } = rotate
		return {
			value,
			basis,
		}
	}
}
