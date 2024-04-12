import {
	type IDesignWithPalette,
	type IDesignTypeCreateOverrides,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from '../clone.service'

export class ClonePaletteDesignStrategy implements ICloneDesignTypeStrategy {
	type: designTypeEnum = DesignTypeEnum.PALETTE

	getDesignTypeOverrides({
		design,
	}: {
		design: IDesignWithPalette
	}): IDesignTypeCreateOverrides {
		const { palette } = design
		const { format, value, opacity } = palette
		return {
			format,
			value,
			opacity,
		}
	}
}
