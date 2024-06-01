import {
	type IDesignWithPalette,
	type IDesignTypeCreateOverrides,
	type IDesignWithType,
	type IDesignWithSize,
	type IDesignWithFill,
	type IDesignWithStroke,
	type IDesignWithLine,
	type IDesignWithRotate,
	type IDesignWithLayout,
	type IDesignWithTemplate,
	type IDesignsByType,
} from '#app/models/design/design.server'
import { DesignTypeEnum, type designTypeEnum } from '#app/schema/design'

export interface ICloneDesignTypeStrategy {
	type: designTypeEnum
	getDesignTypeOverrides(args: {
		design: IDesignWithType
	}): IDesignTypeCreateOverrides
}

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
		const { width, basis, format } = line
		return {
			width,
			basis,
			format,
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

const cloneDesignTypeStrategies: {
	[K in keyof IDesignsByType]?: ICloneDesignTypeStrategy
} = {
	designPalettes: new ClonePaletteDesignStrategy(),
	designSizes: new CloneSizeDesignStrategy(),
	designFills: new CloneFillDesignStrategy(),
	designStrokes: new CloneStrokeDesignStrategy(),
	designLines: new CloneLineDesignStrategy(),
	designRotates: new CloneRotateDesignStrategy(),
	designLayouts: new CloneLayoutDesignStrategy(),
	designTemplates: new CloneTemplateDesignStrategy(),
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
	cloneDesignTypeStrategies,
}
