import { type z } from 'zod'
import { PaletteValueSchema } from './appearances-schema'

// Define an enum for appearance types
export enum AppearanceType {
	Palette = 'palette',
	Size = 'size',
	Rotate = 'rotate',
	FillStyle = 'fill-style',
	StrokeStyle = 'stroke-style',
	LineWidth = 'line-width',
	// Add other appearance types here
}

export const createEmptyAppearanceGroups = (): {
	[key in AppearanceType]: any[]
} => {
	const groups: { [key in AppearanceType]: any[] } = {} as {
		[key in AppearanceType]: any[]
	}

	for (const typeKey of Object.values(AppearanceType)) {
		groups[typeKey] = []
	}

	return groups
}

// Define a type for mapping each appearance type to its slug, type name, and HTML canvas attribute
export type AppearanceMapping = {
	[key in AppearanceType]: {
		slug: string
		typeName: string
		defaultValues: any
		valueSchema?: z.ZodSchema<any>
	}
}

export const appearanceTypeValueSchema = (type: AppearanceType) => {
	return appearanceMapping[type].valueSchema
}

// Define and export the mapping
export const appearanceMapping: AppearanceMapping = {
	[AppearanceType.Palette]: {
		slug: 'palette',
		typeName: 'Palette',
		defaultValues: validateAppearanceTypeValues(AppearanceType.Palette, {
			format: 'hex',
			value: '000000',
			opacity: 1,
		}),
		valueSchema: PaletteValueSchema,
	},
	[AppearanceType.Size]: {
		slug: 'size',
		typeName: 'Size',
		defaultValues: validateAppearanceTypeValues(AppearanceType.Size, {
			unit: '%',
			value: 10,
			basis: 'width',
		}),
	},
	[AppearanceType.Rotate]: {
		slug: 'rotate',
		typeName: 'Rotate',
		defaultValues: validateAppearanceTypeValues(AppearanceType.Rotate, {
			unit: 'deg',
			value: 0,
		}),
	},
	[AppearanceType.FillStyle]: {
		slug: 'fill-style',
		typeName: 'FillStyle',
		defaultValues: validateAppearanceTypeValues(AppearanceType.FillStyle, {
			style: 'solid',
			value: '000000',
			opacity: 1,
		}),
	},
	[AppearanceType.StrokeStyle]: {
		slug: 'stroke-style',
		typeName: 'StrokeStyle',
		defaultValues: validateAppearanceTypeValues(AppearanceType.StrokeStyle, {
			style: 'solid',
			value: '000000',
			opacity: 1,
		}),
	},
	[AppearanceType.LineWidth]: {
		slug: 'line-width',
		typeName: 'LineWidth',
		defaultValues: validateAppearanceTypeValues(AppearanceType.LineWidth, {
			value: '3',
		}),
	},
	// Add other mappings here
}

export function findAppearanceTypeBySlug(slug: string): AppearanceType | null {
	return Object.values(AppearanceType).includes(slug as AppearanceType)
		? (slug as AppearanceType)
		: null
}

export const appearanceNavigation = [
	{
		slug: 'palette',
		type: 'palette',
		name: 'Palette',
	},
	{
		slug: 'size',
		type: 'size',
		name: 'Size',
	},
	{
		slug: 'rotate',
		type: 'rotate',
		name: 'Rotate',
	},
	{
		slug: 'fill-style',
		type: 'fill-style',
		name: 'Fill Style',
	},
	{
		slug: 'stroke-style',
		type: 'stroke-style',
		name: 'Stroke Style',
	},
	{
		slug: 'line-width',
		type: 'line-width',
		name: 'Line Width',
	},

	// Add other appearances here
]

export interface PaletteValues {
	format: 'hex'
	value: string
	opacity: number
}

export interface SizeValues {
	unit: '%' | 'px'
	value: number
	basis: 'width' | 'height'
}

export interface RotateValues {
	unit: 'deg'
	value: number
}

export interface FillStyleValues {
	style: 'solid' | 'gradient'
	value: string
	opacity: number
}

export interface StrokeStyleValues {
	style: 'solid' | 'gradient'
	value: string
	opacity: number
}

export interface LineWidthValues {
	value: string
}

// Map appearance types to their values interfaces
export type AppearanceValuesMap = {
	[AppearanceType.Palette]: PaletteValues
	[AppearanceType.Size]: SizeValues
	[AppearanceType.Rotate]: RotateValues
	[AppearanceType.FillStyle]: FillStyleValues
	[AppearanceType.StrokeStyle]: StrokeStyleValues
	[AppearanceType.LineWidth]: LineWidthValues
	// Extend this map as you add more appearance types and values interfaces
}

// Define a generic function to enforce default value conformity
export function validateAppearanceTypeValues<
	T extends keyof AppearanceValuesMap,
>(type: T, values: AppearanceValuesMap[T]): AppearanceValuesMap[T] {
	return values
}
