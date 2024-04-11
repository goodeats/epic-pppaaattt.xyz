import {
	type IDesignWithTemplate,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from './clone-design-types.service'

export class CloneTemplateDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.TEMPLATE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithTemplate
	}): IDesignTypeCreateOverrides {
		const { template } = design
		const { style } = template
		return {
			style,
		}
	}
}
