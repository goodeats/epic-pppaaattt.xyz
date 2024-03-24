import { type IDesignWithPalette, type IDesignWithType } from './design.server'

export interface IPalette {
	id: string
	format: string
	value: string
	opacity: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export interface IPaletteCreateOverrides {
	format?: string
	value?: string
	opacity?: number
}

export const findPaletteInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IPalette | undefined => {
	const design = designs.find(design => design.palette) as IDesignWithPalette

	return design.palette
}
