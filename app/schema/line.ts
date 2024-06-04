import { z } from 'zod'

export const LineFormatTypeEnum = {
	PIXEL: 'pixel', // exact pixel value
	PERCENT: 'percent', // percent of basis length
	// add more format types here
} as const
export const LineBasisTypeEnum = {
	SIZE: 'size',
	WIDTH: 'width',
	HEIGHT: 'height',
	CANVAS_WIDTH: 'canvas-width',
	CANVAS_HEIGHT: 'canvas-height',
	// add more styles here, like gradient, pattern, etc.
} as const
type ObjectValues<T> = T[keyof T]
export type lineFormatTypeEnum = ObjectValues<typeof LineFormatTypeEnum>
export type lineBasisTypeEnum = ObjectValues<typeof LineBasisTypeEnum>

const LineFormatSchema = z.nativeEnum(LineFormatTypeEnum)
const LineBasisSchema = z.nativeEnum(LineBasisTypeEnum)
const LineWidthSchema = z.number().positive()

export const LineDataSchema = z.object({
	designId: z.string(),
	width: LineWidthSchema.optional(),
	basis: LineBasisSchema.optional(),
	format: LineFormatSchema.optional(),
})

export type DesignLineUpdateSchemaType =
	| typeof EditDesignLineWidthSchema
	| typeof EditDesignLineBasisSchema
	| typeof EditDesignLineFormatSchema

export const EditDesignLineWidthSchema = z.object({
	id: z.string(),
	designId: z.string(),
	width: LineWidthSchema,
})

export const EditDesignLineBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: LineBasisSchema,
})

export const EditDesignLineFormatSchema = z.object({
	id: z.string(),
	designId: z.string(),
	format: LineFormatSchema,
})

export const lineFormatIcon = (format: lineFormatTypeEnum) => {
	return format === LineFormatTypeEnum.PERCENT ? '%' : 'px'
}

export const lineFormatIconTooltip = (format: lineFormatTypeEnum) => {
	return format === LineFormatTypeEnum.PERCENT
		? 'Line width is a percentage of the basis'
		: 'Line width is a fixed pixel value'
}

export const lineBasisIcon = (basis: lineBasisTypeEnum) => {
	switch (basis) {
		case LineBasisTypeEnum.SIZE:
			return 'vercel-logo' // ha ha it's a triangle
		case LineBasisTypeEnum.WIDTH:
			return 'width'
		case LineBasisTypeEnum.HEIGHT:
			return 'height'
		case LineBasisTypeEnum.CANVAS_WIDTH:
			return 'stretch-horizontally'
		case LineBasisTypeEnum.CANVAS_HEIGHT:
			return 'stretch-vertically'
		default:
			return 'width'
	}
}

export const lineBasisIconTooltip = (basis: lineBasisTypeEnum) => {
	switch (basis) {
		case LineBasisTypeEnum.SIZE:
			return 'Line width is based on the design size'
		case LineBasisTypeEnum.WIDTH:
			return 'Line width is based on the layer width'
		case LineBasisTypeEnum.HEIGHT:
			return 'Line width is based on the layer height'
		case LineBasisTypeEnum.CANVAS_WIDTH:
			return 'Line width is based on the canvas width'
		case LineBasisTypeEnum.CANVAS_HEIGHT:
			return 'Line width is based on the canvas height'
		default:
			return 'Line width is based on the layer width'
	}
}
