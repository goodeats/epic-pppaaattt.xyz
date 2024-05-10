import { z } from 'zod'

export const SizeFormatTypeEnum = {
	PERCENT: 'percent', // percent of basis length
	PIXEL: 'pixel', // exact pixel value
	// add more format types here
} as const
export const SizeBasisTypeEnum = {
	WIDTH: 'width',
	HEIGHT: 'height',
	CANVAS_WIDTH: 'canvas-width',
	CANVAS_HEIGHT: 'canvas-height',
	// add more styles here, like gradient, pattern, etc.
} as const
type ObjectValues<T> = T[keyof T]
export type sizeFormatTypeEnum = ObjectValues<typeof SizeFormatTypeEnum>
export type sizeBasisTypeEnum = ObjectValues<typeof SizeBasisTypeEnum>

const SizeFormatSchema = z.nativeEnum(SizeFormatTypeEnum)
const SizeBasisSchema = z.nativeEnum(SizeBasisTypeEnum)
const SizeValueSchema = z.number().positive()

export const SizeDataSchema = z.object({
	designId: z.string(),
	format: SizeFormatSchema.optional(),
	value: SizeValueSchema.optional(),
	basis: SizeBasisSchema.optional(),
})

export type DesignSizeUpdateSchemaType =
	| typeof EditDesignSizeValueSchema
	| typeof EditDesignSizeBasisSchema
	| typeof EditDesignSizeFormatSchema

export const EditDesignSizeValueSchema = z.object({
	id: z.string(),
	designId: z.string(),
	value: SizeValueSchema,
})

export const EditDesignSizeBasisSchema = z.object({
	id: z.string(),
	designId: z.string(),
	basis: SizeBasisSchema,
})

export const EditDesignSizeFormatSchema = z.object({
	id: z.string(),
	designId: z.string(),
	format: SizeFormatSchema,
})

export const sizeFormatIcon = (format: sizeFormatTypeEnum) => {
	return format === SizeFormatTypeEnum.PERCENT ? '%' : 'px'
}

export const sizeBasisIcon = (basis: sizeBasisTypeEnum) => {
	switch (basis) {
		case SizeBasisTypeEnum.WIDTH:
			return 'width'
		case SizeBasisTypeEnum.HEIGHT:
			return 'height'
		case SizeBasisTypeEnum.CANVAS_WIDTH:
			return 'stretch-horizontally'
		case SizeBasisTypeEnum.CANVAS_HEIGHT:
			return 'stretch-vertically'
		default:
			return 'width'
	}
}
