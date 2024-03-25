import { PaletteDataSchema } from '#app/schema/palette'
import { prisma } from '#app/utils/db.server'
import {
	type IDesignTypeCreateOverrides,
	type IDesign,
	type IDesignWithPalette,
	type IDesignWithType,
} from './design.server'

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

export const createDesignPalette = ({
	designId,
	designTypeOverrides,
}: {
	designId: IDesign['id']
	designTypeOverrides: IDesignTypeCreateOverrides
}) => {
	const paletteData = {
		designId,
		...(designTypeOverrides as IPaletteCreateOverrides),
	}
	const data = PaletteDataSchema.parse(paletteData)

	return prisma.palette.create({ data })
}
