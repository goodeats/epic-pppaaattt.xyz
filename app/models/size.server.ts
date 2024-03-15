import { type IDesignWithSize, type IDesignWithType } from './design.server'

export interface ISize {
	id: string
	format: string
	value: number
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findSizeInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ISize | undefined => {
	const design = designs.find(design => design.size) as IDesignWithSize

	return design.size
}
