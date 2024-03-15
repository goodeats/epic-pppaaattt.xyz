import { type IDesignWithRotate, type IDesignWithType } from './design.server'

export interface IRotate {
	id: string
	rotation: number
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findRotateInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IRotate | undefined => {
	const design = designs.find(design => design.rotate) as IDesignWithRotate

	return design.rotate
}
