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

// Define a type for mapping each appearance type to its slug, type name, and HTML canvas attribute
export type AppearanceMapping = {
	[key in AppearanceType]: {
		slug: string
		typeName: string
	}
}

// Define and export the mapping
export const appearanceMapping: AppearanceMapping = {
	[AppearanceType.Palette]: {
		slug: 'palette',
		typeName: 'Palette',
	},
	[AppearanceType.Size]: {
		slug: 'size',
		typeName: 'Size',
	},
	[AppearanceType.Rotate]: {
		slug: 'rotate',
		typeName: 'Rotate',
	},
	[AppearanceType.FillStyle]: {
		slug: 'fill-style',
		typeName: 'FillStyle',
	},
	[AppearanceType.StrokeStyle]: {
		slug: 'stroke-style',
		typeName: 'StrokeStyle',
	},
	[AppearanceType.LineWidth]: {
		slug: 'line-width',
		typeName: 'LineWidth',
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
