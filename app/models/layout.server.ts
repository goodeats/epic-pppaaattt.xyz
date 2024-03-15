import { type IDesignWithLayout, type IDesignWithType } from './design.server'

export interface ILayout {
	id: string
	style: string
	count: number
	rows: number
	columns: number
	createdAt: Date | string
	updatedAt: Date | string
	designId: string
}

export const findLayoutInDesignArray = ({
	designs,
}: {
	designs: IDesignWithType[]
}): ILayout | undefined => {
	const design = designs.find(design => design.layout) as IDesignWithLayout

	return design.layout
}
