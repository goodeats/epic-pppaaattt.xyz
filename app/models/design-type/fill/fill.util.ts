import {
	type IDesignWithFill,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type IFill } from './fill.server'

export const findFirstFillInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IFill | null => {
	const design = designs.find(design => design.fill) as IDesignWithFill

	return design?.fill || null
}
