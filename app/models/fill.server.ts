import { type IDesignWithFill, type IDesignWithType } from './design.server'

export interface IFill {
	id: string
	style: string
	value: string
	basis: string
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findFillInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): IFill | undefined => {
	const design = designs.find(design => design.fill) as IDesignWithFill

	return design.fill
}
