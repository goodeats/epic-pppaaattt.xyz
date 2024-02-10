import { type IAppearancesOnArtboard } from './db.server'

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
	}
}

// Define and export the mapping
export const appearanceMapping: AppearanceMapping = {
	[AppearanceType.Palette]: {
		slug: 'palette',
		typeName: 'Palette',
		defaultValues: { format: 'hex', value: '#000000', opacity: 1 },
	},
	[AppearanceType.Size]: {
		slug: 'size',
		typeName: 'Size',
		defaultValues: { unit: '%', value: 10, basis: 'width' },
	},
	[AppearanceType.Rotate]: {
		slug: 'rotate',
		typeName: 'Rotate',
		defaultValues: { unit: 'deg', value: 0 },
	},
	[AppearanceType.FillStyle]: {
		slug: 'fill-style',
		typeName: 'FillStyle',
		defaultValues: { style: 'solid', value: '#000000', opacity: 1 },
	},
	[AppearanceType.StrokeStyle]: {
		slug: 'stroke-style',
		typeName: 'StrokeStyle',
		defaultValues: { style: 'solid', value: '#000000', opacity: 1 },
	},
	[AppearanceType.LineWidth]: {
		slug: 'line-width',
		typeName: 'LineWidth',
		defaultValues: { value: '3' },
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

// Defines a type for grouping appearances by their type, where each group contains an array of appearances on an artboard.
export type GroupedAppearances = {
	[K in AppearanceType]?: IAppearancesOnArtboard[]
}
