import {
	type IDesignWithLayout,
	type IDesignTypeCreateOverrides,
	type IDesignWithFill,
	type IDesignWithLine,
	type IDesignWithPalette,
	type IDesignWithRotate,
	type IDesignWithSize,
	type IDesignWithStroke,
	type IDesignWithTemplate,
} from '#app/models/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'
import { type ICloneDesignTypeStrategy } from '../clone-many.service'

class ClonePaletteDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneSizeDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneFillDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneStrokeDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneLineDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneRotateDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneLayoutDesignStrategy implements ICloneDesignTypeStrategy {
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

class CloneTemplateDesignStrategy implements ICloneDesignTypeStrategy {
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

export {
	ClonePaletteDesignStrategy,
	CloneSizeDesignStrategy,
	CloneFillDesignStrategy,
	CloneStrokeDesignStrategy,
	CloneLineDesignStrategy,
	CloneRotateDesignStrategy,
	CloneLayoutDesignStrategy,
	CloneTemplateDesignStrategy,
}
