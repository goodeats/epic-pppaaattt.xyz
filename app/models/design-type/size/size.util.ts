import {
	type IDesignWithSize,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type ISize } from './size.server'

export const findFirstSizeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ISize | null => {
	const design = designs.find(design => design.size) as IDesignWithSize

	return design?.size || null
}
