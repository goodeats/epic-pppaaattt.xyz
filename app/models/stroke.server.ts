import { type IDesignWithStroke, type IDesignWithType } from './design.server'

export interface IStroke {
	id: string
	style: string
	value: string
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findStrokeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IStroke | undefined => {
	const design = designs.find(design => design.stroke) as IDesignWithStroke

	return design.stroke
}
