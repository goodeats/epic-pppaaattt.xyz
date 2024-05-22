import {
	type IDesignWithPalette,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type IPalette } from './palette.server'

export const findFirstPaletteInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IPalette | null => {
	const design = designs.find(design => design.palette) as IDesignWithPalette

	return design?.palette || null
}
