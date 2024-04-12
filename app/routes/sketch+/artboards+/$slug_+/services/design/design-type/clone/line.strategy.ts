import {
	type IDesignWithLine,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from '../clone.service'

export class CloneLineDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.LINE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithLine
	}): IDesignTypeCreateOverrides {
		const { line } = design
		const { width } = line
		return {
			width,
		}
	}
}
