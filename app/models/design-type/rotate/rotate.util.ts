import {
	type IDesignWithRotate,
	type IDesignWithType,
} from '#app/models/design/design.server'
import { type IRotate } from './rotate.server'

export const findFirstRotateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IRotate | null => {
	const design = designs.find(design => design.rotate) as IDesignWithRotate

	return design?.rotate || null
}
